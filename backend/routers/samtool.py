from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from fastapi.responses import JSONResponse
from typing import Optional, List
import tempfile
import os
import io
import base64
import hashlib
import json
import qrcode
from urllib.parse import quote, unquote
import PyPDF2
from PIL import Image
from pydantic import BaseModel
import secrets
import string
import random
import math
from datetime import datetime, date
from database import get_db
import security

router = APIRouter(
    prefix="/samtool",
    tags=["SAM Toolbox"]
)

class HashRequest(BaseModel):
    text: str
    algorithm: str = "sha256"

class Base64Request(BaseModel):
    text: str

class URLRequest(BaseModel):
    text: str

class JSONFormatRequest(BaseModel):
    json_text: str

class UUIDRequest(BaseModel):
    count: int = 1

class SearchRequest(BaseModel):
    query: str

class PDFRotateRequest(BaseModel):
    angle: int = 90

class InvoiceRequest(BaseModel):
    data: dict

class GovernmentService(BaseModel):
    id: str
    name: str
    category: str
    description: str
    link: str
    requirements: List[str]

class Gazette(BaseModel):
    id: str
    title: str
    date: str
    category: str
    url: str

class FormInfo(BaseModel):
    id: str
    name: str
    category: str
    download_url: str
    description: str

GOVERNMENT_SERVICES = [
    {"id": "nic", "name": "National Identity Card (NIC)", "category": "Identity", "description": "Apply for or renew your Sri Lankan National Identity Card.", "link": "https://www.drp.gov.lk", "requirements": ["Birth Certificate", "Passport size photo", "Proof of residence"]},
    {"id": "passport", "name": "Passport Application", "category": "Travel", "description": "Apply for a new Sri Lankan passport or renew an existing one.", "link": "https://www.immigration.gov.lk", "requirements": ["NIC", "Birth Certificate", "Passport photos", "Application fee"]},
    {"id": "driving-license", "name": "Driving License", "category": "Transport", "description": "Apply for a learner permit or driving license.", "link": "https://www.dmt.gov.lk", "requirements": ["NIC", "Medical certificate", "Passport photos", "Theory test results"]},
    {"id": "birth-cert", "name": "Birth Certificate", "category": "Identity", "description": "Apply for a new birth certificate or get a certified copy.", "link": "https://www.registrar-general.gov.lk", "requirements": ["Parents NIC", "Hospital records", "Application form"]},
    {"id": "epf", "name": "EPF Membership", "category": "Finance", "description": "Check EPF balance, apply for withdrawal, or register as an employer.", "link": "https://www.epf.lk", "requirements": ["NIC", "Employment details", "Bank account details"]},
    {"id": "permit", "name": "Trade Permit", "category": "Business", "description": "Apply for a municipal trade permit for business operations.", "link": "https://www.localgov.gov.lk", "requirements": ["NIC", "Business registration", "Lease agreement", "Photos"]},
    {"id": "land", "name": "Land Registration", "category": "Property", "description": "Register land ownership or transfer property deeds.", "link": "https://www.lands.gov.lk", "requirements": ["NIC", "Deed", "Survey plan", "Valuation certificate"]},
    {"id": "pension", "name": "Public Service Pension", "category": "Finance", "description": "Apply for or manage government pension benefits.", "link": "https://www.pension.gov.lk", "requirements": ["NIC", "Service records", "Bank details", "Medical reports"]},
    {"id": "visa", "name": "Visa Application", "category": "Travel", "description": "Apply for tourist, business, or residence visas.", "link": "https://www.immigration.gov.lk", "requirements": ["Passport", "Photos", "Bank statement", "Purpose of visit"]},
    {"id": "tax", "name": "Tax Registration (TIN)", "category": "Finance", "description": "Apply for a Tax Identification Number (TIN).", "link": "https://www.ird.gov.lk", "requirements": ["NIC", "Business registration", "Address proof"]},
    {"id": "samurdhi", "name": "Samurdhi Allowance", "category": "Social", "description": "Apply for Samurdhi monthly allowance benefits.", "link": "https://www.samurdhi.gov.lk", "requirements": ["NIC", "Family records", "Income certificate", "Bank details"]},
    {"id": "voter", "name": "Voter Registration", "category": "Identity", "description": "Register as a voter or update voter details.", "link": "https://www.elections.gov.lk", "requirements": ["NIC", "Proof of residence", "Passport photos"]},
]

GAZETTES = [
    {"id": "gaz-2024-01", "title": "Extraordinary Gazette No. 2384/01", "date": "2024-01-15", "category": "Appointments", "url": "#"},
    {"id": "gaz-2024-02", "title": "Extraordinary Gazette No. 2385/02", "date": "2024-01-22", "category": "Legislation", "url": "#"},
    {"id": "gaz-2024-03", "title": "Extraordinary Gazette No. 2386/01", "date": "2024-02-05", "category": "Notices", "url": "#"},
    {"id": "gaz-2024-04", "title": "Extraordinary Gazette No. 2387/02", "date": "2024-02-18", "category": "Appointments", "url": "#"},
    {"id": "gaz-2024-05", "title": "Extraordinary Gazette No. 2388/01", "date": "2024-03-01", "category": "Legislation", "url": "#"},
    {"id": "gaz-2024-06", "title": "Extraordinary Gazette No. 2389/02", "date": "2024-03-15", "category": "Notices", "url": "#"},
]

FORMS = [
    {"id": "form-01", "name": "NIC Application Form", "category": "Identity", "download_url": "#", "description": "Standard application form for National Identity Card."},
    {"id": "form-02", "name": "Passport Application Form", "category": "Travel", "download_url": "#", "description": "Application form for Sri Lankan passport."},
    {"id": "form-03", "name": "Driving License Application", "category": "Transport", "download_url": "#", "description": "Application form for driving license."},
    {"id": "form-04", "name": "Birth Registration Form", "category": "Identity", "download_url": "#", "description": "Form for registering a birth."},
    {"id": "form-05", "name": "EPF Withdrawal Form", "category": "Finance", "download_url": "#", "description": "Form to apply for EPF withdrawal."},
    {"id": "form-06", "name": "Visa Application Form", "category": "Travel", "download_url": "#", "description": "Standard visa application form."},
]

@router.post("/pdf/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    try:
        merger = PyPDF2.PdfMerger()
        file_refs = []
        for f in files:
            content = await f.read()
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
            tmp.write(content)
            tmp.close()
            file_refs.append(tmp.name)
            merger.append(tmp.name)
        output = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        output.close()
        merger.write(output.name)
        merger.close()
        with open(output.name, "rb") as mf:
            data = mf.read()
        for path in file_refs:
            os.remove(path)
        os.remove(output.name)
        b64 = base64.b64encode(data).decode()
        return {"status": "success", "filename": "merged.pdf", "size": len(data), "base64": b64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF merge failed: {str(e)}")

@router.post("/pdf/split")
async def split_pdf(file: UploadFile = File(...), start_page: int = Form(1), end_page: int = Form(...)):
    try:
        content = await file.read()
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        tmp.write(content)
        tmp.close()
        reader = PyPDF2.PdfReader(tmp.name)
        total = len(reader.pages)
        start = max(1, start_page)
        end = min(total, end_page) if end_page else total
        writer = PyPDF2.PdfWriter()
        for i in range(start - 1, end):
            writer.add_page(reader.pages[i])
        output = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        output.close()
        with open(output.name, "wb") as f:
            writer.write(f)
        with open(output.name, "rb") as mf:
            data = mf.read()
        os.remove(tmp.name)
        os.remove(output.name)
        b64 = base64.b64encode(data).decode()
        return {"status": "success", "pages_extracted": end - start + 1, "base64": b64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF split failed: {str(e)}")

@router.post("/pdf/compress")
async def compress_pdf(file: UploadFile = File(...)):
    try:
        content = await file.read()
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        tmp.write(content)
        tmp.close()
        reader = PyPDF2.PdfReader(tmp.name)
        writer = PyPDF2.PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        output = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        output.close()
        with open(output.name, "wb") as f:
            writer.write(f)
        with open(output.name, "rb") as mf:
            data = mf.read()
        os.remove(tmp.name)
        os.remove(output.name)
        b64 = base64.b64encode(data).decode()
        ratio = round((1 - len(data) / len(content)) * 100, 2) if len(content) > 0 else 0
        return {"status": "success", "original_size": len(content), "compressed_size": len(data), "ratio": f"{ratio}%", "base64": b64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF compress failed: {str(e)}")

@router.post("/pdf/rotate")
async def rotate_pdf(file: UploadFile = File(...), angle: int = Form(90)):
    try:
        content = await file.read()
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        tmp.write(content)
        tmp.close()
        reader = PyPDF2.PdfReader(tmp.name)
        writer = PyPDF2.PdfWriter()
        for page in reader.pages:
            page.rotate(angle)
            writer.add_page(page)
        output = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        output.close()
        with open(output.name, "wb") as f:
            writer.write(f)
        with open(output.name, "rb") as mf:
            data = mf.read()
        os.remove(tmp.name)
        os.remove(output.name)
        b64 = base64.b64encode(data).decode()
        return {"status": "success", "angle": angle, "base64": b64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF rotate failed: {str(e)}")

@router.post("/pdf/to-images")
async def pdf_to_images(file: UploadFile = File(...)):
    try:
        content = await file.read()
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        tmp.write(content)
        tmp.close()
        reader = PyPDF2.PdfReader(tmp.name)
        images = []
        try:
            from pdf2image import convert_from_path
            pil_images = convert_from_path(tmp.name)
            for idx, img in enumerate(pil_images):
                buf = io.BytesIO()
                img.save(buf, format="PNG")
                b64 = base64.b64encode(buf.getvalue()).decode()
                images.append({"page": idx + 1, "base64": b64})
        except Exception:
            for idx, page in enumerate(reader.pages):
                images.append({"page": idx + 1, "text": (page.extract_text() or "")[:500], "base64": None})
        os.remove(tmp.name)
        return {"status": "success", "pages": len(images), "images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF to images failed: {str(e)}")

@router.post("/images/to-pdf")
async def images_to_pdf(files: List[UploadFile] = File(...)):
    try:
        images = []
        for f in files:
            content = await f.read()
            img = Image.open(io.BytesIO(content))
            if img.mode != "RGB":
                img = img.convert("RGB")
            images.append(img)
        if not images:
            raise HTTPException(status_code=400, detail="No images provided")
        output = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        output.close()
        images[0].save(output.name, save_all=True, append_images=images[1:])
        with open(output.name, "rb") as mf:
            data = mf.read()
        os.remove(output.name)
        b64 = base64.b64encode(data).decode()
        return {"status": "success", "pages": len(images), "base64": b64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Images to PDF failed: {str(e)}")

@router.post("/qr/generate")
async def generate_qr(data: str = Form(...)):
    try:
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode()
        return {"status": "success", "data": data, "base64": b64, "format": "png"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR generation failed: {str(e)}")

@router.post("/hash/generate")
async def generate_hash(req: HashRequest):
    try:
        algo = req.algorithm.lower()
        if algo not in ["md5", "sha1", "sha256", "sha512"]:
            raise HTTPException(status_code=400, detail="Unsupported algorithm. Use md5, sha1, sha256, or sha512")
        h = hashlib.new(algo)
        h.update(req.text.encode())
        return {"status": "success", "algorithm": algo, "hash": h.hexdigest(), "input": req.text}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hash generation failed: {str(e)}")

@router.post("/base64/encode")
async def base64_encode(req: Base64Request):
    try:
        encoded = base64.b64encode(req.text.encode()).decode()
        return {"status": "success", "original": req.text, "encoded": encoded}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Base64 encode failed: {str(e)}")

@router.post("/base64/decode")
async def base64_decode(req: Base64Request):
    try:
        decoded = base64.b64decode(req.text.encode()).decode()
        return {"status": "success", "original": req.text, "decoded": decoded}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Base64 decode failed: {str(e)}")

@router.post("/url/encode")
async def url_encode(req: URLRequest):
    try:
        encoded = quote(req.text, safe='')
        return {"status": "success", "original": req.text, "encoded": encoded}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL encode failed: {str(e)}")

@router.post("/url/decode")
async def url_decode(req: URLRequest):
    try:
        decoded = unquote(req.text)
        return {"status": "success", "original": req.text, "decoded": decoded}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL decode failed: {str(e)}")

@router.post("/json/format")
async def json_format(req: JSONFormatRequest):
    try:
        parsed = json.loads(req.json_text)
        formatted = json.dumps(parsed, indent=2, ensure_ascii=False)
        return {"status": "success", "formatted": formatted, "size": len(formatted)}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JSON format failed: {str(e)}")

@router.post("/uuid/generate")
async def generate_uuid(req: UUIDRequest):
    try:
        count = max(1, min(req.count, 100))
        uuids = [str(__import__('uuid').uuid4()) for _ in range(count)]
        return {"status": "success", "count": count, "uuids": uuids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"UUID generation failed: {str(e)}")

@router.post("/government/search")
async def search_government(req: SearchRequest):
    try:
        query = req.query.lower()
        results = [s for s in GOVERNMENT_SERVICES if query in s["name"].lower() or query in s["category"].lower() or query in s["description"].lower()]
        return {"status": "success", "query": req.query, "count": len(results), "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/government/gazettes")
async def list_gazettes():
    try:
        return {"status": "success", "count": len(GAZETTES), "gazettes": GAZETTES}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list gazettes: {str(e)}")

@router.get("/government/forms")
async def list_forms():
    try:
        return {"status": "success", "count": len(FORMS), "forms": FORMS}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list forms: {str(e)}")

@router.post("/invoice/generate")
async def generate_invoice(req: InvoiceRequest, format: str = Form("json")):
    try:
        data = req.data
        invoice_number = data.get("invoice_number", f"INV-{datetime.now().strftime('%Y%m%d%H%M%S')}")
        date_issued = data.get("date", datetime.now().strftime("%Y-%m-%d"))
        due_date = data.get("due_date", "")
        client_name = data.get("client_name", "Client")
        client_address = data.get("client_address", "")
        items = data.get("items", [])
        subtotal = sum(item.get("amount", 0) for item in items)
        tax_rate = data.get("tax_rate", 0)
        tax_amount = subtotal * (tax_rate / 100)
        total = subtotal + tax_amount
        notes = data.get("notes", "")
        invoice_json = {
            "invoice_number": invoice_number,
            "date_issued": date_issued,
            "due_date": due_date,
            "client": {"name": client_name, "address": client_address},
            "items": items,
            "subtotal": subtotal,
            "tax_rate": f"{tax_rate}%",
            "tax_amount": round(tax_amount, 2),
            "total": round(total, 2),
            "notes": notes,
            "currency": "LKR"
        }
        if format == "pdf":
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet
            from reportlab.lib import colors
            output = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
            output.close()
            doc = SimpleDocTemplate(output.name, pagesize=letter)
            styles = getSampleStyleSheet()
            elements = []
            elements.append(Paragraph(f"<b>INVOICE {invoice_number}</b>", styles["Title"]))
            elements.append(Spacer(1, 12))
            elements.append(Paragraph(f"Date: {date_issued}<br/>Due Date: {due_date}<br/>Client: {client_name}", styles["Normal"]))
            elements.append(Spacer(1, 12))
            table_data = [["Item", "Qty", "Rate", "Amount"]] + [[item.get("description", ""), item.get("qty", 1), item.get("rate", 0), item.get("amount", 0)] for item in items]
            table = Table(table_data)
            table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.grey), ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke), ("ALIGN", (0, 0), (-1, -1), "CENTER"), ("GRID", (0, 0), (-1, -1), 1, colors.black)]))
            elements.append(table)
            elements.append(Spacer(1, 12))
            elements.append(Paragraph(f"<b>Total: LKR {round(total, 2)}</b>", styles["Normal"]))
            doc.build(elements)
            with open(output.name, "rb") as mf:
                data = mf.read()
            os.remove(output.name)
            b64 = base64.b64encode(data).decode()
            return {"status": "success", "format": "pdf", "base64": b64}
        return {"status": "success", "format": "json", "invoice": invoice_json}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invoice generation failed: {str(e)}")
