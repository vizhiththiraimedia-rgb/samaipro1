import os
from dotenv import load_dotenv

load_dotenv()

async def get_ai_response(user_message: str, chat_history: list = None, system_prompt: str = None) -> str:
    from prompts import SAMAI_SYSTEM_PROMPT
    default_prompt = SAMAI_SYSTEM_PROMPT
    messages = [
        {"role": "system", "content": system_prompt if system_prompt else default_prompt}
    ]
    
    if chat_history:
        for chat in chat_history:
            # Assuming chat object has .role and .content, otherwise if dict use chat['role']
            role = getattr(chat, 'role', chat.get('role', 'user') if isinstance(chat, dict) else 'user')
            content = getattr(chat, 'content', chat.get('content', '') if isinstance(chat, dict) else str(chat))
            messages.append({"role": role, "content": content})
            
    messages.append({"role": "user", "content": user_message})
    
    try:
        from api_hub import api_hub
        result = await api_hub.chat(messages, max_tokens=4000)
        return result["content"]
    except Exception as e:
        print(f"API Hub Notice/Fallback: {e}")
        user_lower = user_message.lower().strip()
        if any(w in user_lower for w in ["hi", "hello", "vanakkam", "hey", "ayubowan"]):
            return "Hello! ?? I am SAM AI. How can I assist you today?"
        elif any(w in user_lower for w in ["who are you", "name", "your name"]):
            return "I am SAM AI, your personal intelligent assistant powered by Google Gemini and multi-model AI engines."
        elif any(w in user_lower for w in ["help", "what can you do"]):
            return "I can help you with text translations, code generation, voice synthesis, image analysis, and smart learning!"
        else:
            return f"SAM AI Engine Response: I have received your message: '{user_message}'. I am ready to help you with coding, translation, and learning tasks!"
