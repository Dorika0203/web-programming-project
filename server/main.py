from fastapi import FastAPI
from fastapi.responses import FileResponse

app = FastAPI()

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
