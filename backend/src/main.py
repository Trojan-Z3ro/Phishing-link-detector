import os
import pickle
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

frontend_url = os.getenv("FRONTEND_URL", "*")

app = FastAPI(title="Phishing URL Detection", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserInput(BaseModel):
    url: str


vector = pickle.load(open("backend/src/ml_model/vectorizer.pkl", "rb"))
model = pickle.load(open("backend/src/ml_model/phishing.pkl", "rb"))


@app.get("/")
def root():
    return {"message": "Phishing URL Detection API is running 🚀"}


@app.post("/predict_url")
def predict_url(input_data: UserInput):
    try:
        url = input_data.url

        cleaned_url = re.sub(r"^https?://(www\.)?", "", url.lower())

        vectorized_url = vector.transform([cleaned_url])

        prediction = model.predict(vectorized_url)[0]
        print(prediction)

        label = (
            "This is a Phishing website !!"
            if prediction == "bad"
            else "This is healthy and good website !!"
        )
        print(label)

        return {"url": url, "prediction": prediction, "message": label}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
