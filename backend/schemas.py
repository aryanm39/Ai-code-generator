from pydantic import BaseModel

class CodeGenerationRequest(BaseModel):
    language: str
    problem_statement: str

class CodeGenerationResponse(BaseModel):
    language: str
    code: str
