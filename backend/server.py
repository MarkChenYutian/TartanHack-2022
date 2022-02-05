import os
import uvicorn
from fastapi import FastAPI

app = FastAPI()


@app.get('/')
async def index():
    return "Hello World!"


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
