from fastapi import FastAPI, Form, File, UploadFile
from datetime import datetime
import aiofiles

app = FastAPI()

@app.post("/form")
def basic_form(username: str = Form(...), password: str = Form(default=..., min_length=6)):
    print(username, password)
    return { "username": username, "password": password }  

#@app.post("/fileform")
#def file_form(file: File = File(...), description: Optional[str] = None):
#    with open("file.txt", "wb") as f:
#        f.write(file)

#@app.post("/fileform")
#async def file_form(file: UploadFile = File(...), description: Optional[str] = None):
#    contents = await file.read()
#    print(contents)
#    return {"filename": file.filename}

#@app.post("/fileform")
#async def file_form(file: UploadFile = File(...), description: Optional[str] = None):
#    safe_filename = file.filename.replace("/", "_").replace("\\", "_")

#    unique_filename = str(datetime.now()) + "__" + safe_filename

#    with open("./uploads/"+unique_filename, "wb") as f:
        # := kaldes walrus operator
#        while content := await file.read(1024): # læser i chunks af 1024
#            f.write(content)

@app.post("/fileform")
async def file_form(file: UploadFile = File(...), description: Optional[str] = None):
    safe_filename = file.filename.replace("/", "_").replace("\\", "_")

    unique_filename = str(datetime.now()) + "__" + safe_filename

    async with aiofiles.open("./uploads/"+unique_filename, "wb") as f:
        # := kaldes walrus operator
        while content := await file.read(1024): # læser i chunks af 1024
            f.write(content)