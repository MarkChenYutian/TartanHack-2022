# internal dependencies
import firebase

# external dependencies
import os
import uuid
import uvicorn
import aiofiles
from fastapi import FastAPI, Request, Response
from fastapi.responses import FileResponse

# initialize FastAPI
app = FastAPI()


async def write(filename: str, content: bytes):
    async with aiofiles.open(f'./{filename}', 'wb') as out_file:
        await out_file.write(content)
    return filename


@app.post('/upload/ios/image/{pid}')
async def upload_ios_image(request: Request, pid: str):
    pid = '{}'.format(str(uuid.uuid4()).replace('-', '')[::4]) if not pid else pid
    await write(f'{pid}.jpg', await request.body())
    return Response(firebase.upload_image(f'{pid}.jpg'), 200)


@app.post('/upload/web/image/{pid}')
async def upload_web_image(request: Request, pid: str):
    pid = '{}'.format(str(uuid.uuid4()).replace('-', '')[::4]) if not pid else pid
    await write(f'{pid}.jpg', await request.body())
    return Response(firebase.upload_image(f'{pid}.jpg'), 200)


@app.get('/download/ios/image/{pid}')
async def download_ios_image(pid: str):
    return FileResponse(firebase.download_image(f'{pid}.jpg'), status_code=200)


@app.get('/download/web/image/{pid}')
async def download_web_image(pid: str):
    return FileResponse(firebase.download_image(f'{pid}.jpg'), status_code=200)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
