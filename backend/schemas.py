from pydantic import BaseModel

class CodeGenerationRequest(BaseModel):
    language: str
    problem_statement: str


class CodeOptimizationRequest(BaseModel):
    language: str
    code: str


class CodeGenerationResponse(BaseModel):
    language: str
    code: str


class CodeOptimizationResponse(BaseModel):
    language: str
    original_code: str
    optimized_code: str
    improvements: list[str]
    performance_gain: str
