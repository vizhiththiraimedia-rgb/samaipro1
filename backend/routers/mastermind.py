from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import os
import urllib.request
import asyncio

router = APIRouter(
    prefix="/mastermind",
    tags=["SAM Mastermind"]
)

# Using a tiny GGUF model for quick real testing on consumer hardware (e.g., Qwen1.5-0.5B or a MiniMind equivalent)
# We will use a small model that downloads fast.
MODEL_URL = "https://huggingface.co/Qwen/Qwen1.5-0.5B-Chat-GGUF/resolve/main/qwen1_5-0_5b-chat-q4_k_m.gguf"
MODEL_FILENAME = "sam_mastermind_model.gguf"
MODEL_PATH = os.path.join(os.getcwd(), "models", MODEL_FILENAME)

os.makedirs(os.path.join(os.getcwd(), "models"), exist_ok=True)

class ChatRequest(BaseModel):
    message: str

download_progress = {"status": "idle", "percent": 0}

def download_model_task():
    try:
        download_progress["status"] = "downloading"
        download_progress["percent"] = 0
        
        def reporthook(blocknum, blocksize, totalsize):
            readsofar = blocknum * blocksize
            if totalsize > 0:
                percent = int(readsofar * 100 / totalsize)
                if percent > 100: percent = 100
                download_progress["percent"] = percent

        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH, reporthook)
        download_progress["status"] = "ready"
        download_progress["percent"] = 100
    except Exception as e:
        download_progress["status"] = f"error: {str(e)}"

@router.get("/status")
def get_status():
    if os.path.exists(MODEL_PATH):
        return {"status": "ready", "percent": 100}
    return download_progress

@router.post("/download")
def start_download(background_tasks: BackgroundTasks):
    if os.path.exists(MODEL_PATH):
        return {"message": "Model already exists"}
    if download_progress["status"] == "downloading":
        return {"message": "Download already in progress"}
    
    background_tasks.add_task(download_model_task)
    return {"message": "Download started"}

@router.post("/chat")
async def chat_local(req: ChatRequest):
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=400, detail="Model not downloaded yet.")
    
    try:
        # Load llama-cpp-python
        from llama_cpp import Llama
        
        # Load model with minimal configuration for CPU/speed
        llm = Llama(
            model_path=MODEL_PATH,
            n_ctx=512,
            n_threads=4,
            verbose=False
        )
        
        # Real Inference
        prompt = f"<|im_start|>system\nYou are SAM Mastermind, a highly intelligent offline AI running locally.<|im_end|>\n<|im_start|>user\n{req.message}<|im_end|>\n<|im_start|>assistant\n"
        
        output = llm(
            prompt,
            max_tokens=200,
            stop=["<|im_end|>"],
            echo=False
        )
        
        response_text = output['choices'][0]['text']
        return {"response": response_text.strip()}
    except ImportError:
        # Fallback for Windows users missing C++ build tools
        fallback_msg = f"[MOCK OFFLINE MODE] I amSAM Mastermind. You asked: '{req.message}'. (Note: llama-cpp-python is missing C++ tools on your PC, so this is a simulated local response)."
        return {"response": fallback_msg}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
