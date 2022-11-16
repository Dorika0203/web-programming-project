from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

testJSON = {
    'a': 'A',
    'b': 'B',
    'c': 'C',
    'd': 'D',
}

# @app.get("/")
# def get_index():
#     return FileResponse('doc.html')

@app.get("/api/getdata")
def get_data():
    return testJSON

@app.get("/")
def get_index():
    return FileResponse("static/index.html")