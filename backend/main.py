from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.genai import types # type: ignore
import json
from schemas import CodeGenerationRequest, CodeGenerationResponse, CodeOptimizationResponse, CodeOptimizationRequest
from services import load_prompt,get_client

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-code", response_model=CodeGenerationResponse)
async def generate_code(request: CodeGenerationRequest):
    if not request.problem_statement.strip():
        raise HTTPException(400, "Problem statement cannot be empty")
     
    client = get_client()
    generate_prompt = load_prompt("generate_code.md")   
    prompt = generate_prompt.format(problem_statement=request.problem_statement,language=request.language)  
    cfg = types.GenerateContentConfig(response_mime_type="application/json")
    resp = client.models.generate_content(model="gemini-flash-latest", contents=prompt, config=cfg)
    data = json.loads(resp.text)
    return CodeGenerationResponse(language=request.language, code=data.get("code", ""))
    

@app.post("/optimize-code", response_model=CodeOptimizationResponse)
async def optimize_code(request: CodeOptimizationRequest):
    if not request.code.strip():
        raise HTTPException(400, "Code cannot be empty")
  
    client = get_client()
    optimize_prompt = load_prompt("optimize_code.md")
    prompt = optimize_prompt.format(code=request.code,language=request.language)
    cfg = types.GenerateContentConfig(response_mime_type="application/json",temperature=0.4)
    resp = client.models.generate_content(model="gemini-flash-latest",contents=prompt,config=cfg)
    data = json.loads(resp.text)
    return CodeOptimizationResponse(
        language=request.language,
        original_code=request.code,
        optimized_code=data.get("optimized_code", ""),
        improvements=data.get("improvements", []),
        performance_gain=data.get("performance_gain", "")
    )
