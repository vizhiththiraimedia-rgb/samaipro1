from fastapi import APIRouter, Request, HTTPException
from api_hub import api_hub
import os

router = APIRouter(
    prefix="/v1",
    tags=["OpenAI Compatible Proxy"]
)

@router.post("/chat/completions")
async def chat_completions(request: Request):
    """
    OpenAI-compatible proxy endpoint.
    This allows external projects to use SAM AI as their primary API hub.
    """
    try:
        body = await request.json()
        messages = body.get("messages", [])
        model = body.get("model")
        
        # Extract additional parameters
        kwargs = {}
        if "temperature" in body:
            kwargs["temperature"] = body["temperature"]
        if "response_format" in body:
            kwargs["response_format"] = body["response_format"]
        if "max_tokens" in body:
            kwargs["max_tokens"] = body["max_tokens"]
            
        if model and "gemini" in model.lower():
            gemini_keys_str = os.getenv("GEMINI_API_KEY", "")
            key = gemini_keys_str.split(",")[0].strip() if gemini_keys_str else ""
            if key and key != "your_gemini_api_key_here":
                from providers.gemini_adapter import GeminiAdapter
                adapter = GeminiAdapter(api_key=key, model=model)
                res = await adapter.chat(messages=messages, model=model, **kwargs)
                return {
                    "id": "chatcmpl-samai-proxy",
                    "object": "chat.completion",
                    "created": 1677652288,
                    "model": res.model,
                    "choices": [{
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": res.content,
                        },
                        "finish_reason": "stop"
                    }],
                    "usage": res.usage
                }

        result = await api_hub.chat(messages=messages, model_override=model, **kwargs)
        
        return {
            "id": "chatcmpl-samai-proxy",
            "object": "chat.completion",
            "created": 1677652288,
            "model": result["model"],
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": result["content"],
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
