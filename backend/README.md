
python -m venv venv

source venv/Scripts/activate

pip install -r requirements.txt

uvicorn main:app --reload
