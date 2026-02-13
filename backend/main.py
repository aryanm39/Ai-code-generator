import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from schemas import CodeGenerationRequest, CodeGenerationResponse
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_system_prompt():
    try:
        with open("prompts/system_prompt.md", "r") as f:
            return f.read()
    except FileNotFoundError:
        return None

system_prompt = load_system_prompt()
MODEL = "gemini-flash-latest"

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set")
    return genai.Client(api_key=api_key)

@app.post("/generate-code", response_model=CodeGenerationResponse)
async def generate_code(request: CodeGenerationRequest):
    if not request.problem_statement.strip():
        raise HTTPException(400, "Problem statement cannot be empty")
     
    try:
        client = get_client()
        if system_prompt is None:
            raise HTTPException(500, "System prompt not found")
        prompt = system_prompt.format(
            problem_statement=request.problem_statement,
            language=request.language
        ) 
        
        cfg = types.GenerateContentConfig(response_mime_type="application/json",)
        resp = client.models.generate_content(model=MODEL,contents=prompt,config=cfg)
        data = json.loads(resp.text)
        return CodeGenerationResponse(language=request.language,code=data.get("code", ""))
        
    except ValueError as e:
        raise HTTPException(500, str(e))
    except Exception as e:
        raise HTTPException(500, f"Code generation failed: {e}")