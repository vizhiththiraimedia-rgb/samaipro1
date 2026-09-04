from fastapi import APIRouter, Depends, HTTPException, Form
from pydantic import BaseModel
from api_hub import api_hub
import json

router = APIRouter(
    prefix="/security",
    tags=["Security Auditor"]
)

class AuditRequest(BaseModel):
    code: str

@router.post("/audit")
async def audit_code(req: AuditRequest):
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
        
    system_prompt = """You are an elite Senior Cyber Security Engineer and Code Auditor.
Your job is to analyze the provided code for security vulnerabilities, bugs, and "vibe coding" bad practices.
Specifically check for:
1. SQL Injection (enforce ORMs like Prisma over raw SQL).
2. Missing Input Validation (enforce Zod, Joi, etc.).
3. Information Leaks (stack traces, unhandled exceptions).
4. Hardcoded secrets (API keys, passwords).
5. Insecure authentication (plaintext passwords, weak JWTs).
6. Cross-Site Scripting (XSS) and CSRF.

Respond ONLY with a valid JSON object in the following format:
{
  "score": <0-100 security score>,
  "status": "<Secure | Vulnerable | Critical>",
  "issues": [
    {
      "severity": "<High | Medium | Low>",
      "title": "<Short title of issue>",
      "description": "<Detailed explanation>",
      "recommendation": "<How to fix it>"
    }
  ],
  "fixed_code": "<The complete refactored and secured code>"
}
Do not include markdown codeblocks around the JSON. Output pure JSON only.
"""
    
    try:
        response_text = api_hub.chat(
            prompt=req.code,
            system_prompt=system_prompt,
            model="openrouter", # Or any default
            max_tokens=2500
        )
        
        # Clean up if LLM added markdown block
        response_text = response_text.strip()
        if response_text.startswith("`json"):
            response_text = response_text[7:]
        if response_text.startswith("`"):
            response_text = response_text[3:]
        if response_text.endswith("`"):
            response_text = response_text[:-3]
            
        result = json.loads(response_text)
        return result
    except json.JSONDecodeError as e:
        # Fallback if LLM failed to return valid JSON
        return {
            "score": 0,
            "status": "Error",
            "issues": [
                {
                    "severity": "High",
                    "title": "Analysis Parsing Failed",
                    "description": "The AI provided an invalid response format.",
                    "recommendation": "Try submitting a smaller code snippet."
                }
            ],
            "fixed_code": response_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
