from dotenv import load_dotenv
import os
from google import genai

load_dotenv()
def load_prompt(filename):
    try:
        with open(f"prompts/{filename}", "r") as f:
            return f.read()
    except FileNotFoundError:
        return None


def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set")
    return genai.Client(api_key=api_key)
