from fastapi import FastAPI

app = FastAPI(title="SpecForge API", version="1.0.0")

@app.get("/")
def root():
    return {"message": "SpecForge backend is running"}