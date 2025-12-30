import sys
import asyncio
import base64
import os
sys.path.append(os.path.dirname(__file__))

from database import SessionLocal, UserDB, engine,QuizProgress
from usermode import User,Compile

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from CompileAPI import submit_code, get_result

app = FastAPI()

frontend_path = Path(__file__).parent.parent / "front-end"
backend_path = Path(__file__).parent.parent / "back-end"
data_path = Path(__file__).parent.parent / "data"
root_path = Path(__file__).parent.parent

app.mount("/static", StaticFiles(directory=frontend_path), name="static")
app.mount("/root", StaticFiles(directory=root_path), name="root")
app.mount("/data", StaticFiles(directory=data_path), name="data")

# These are path
BASE_DIR = Path(__file__).parent.parent

pages_dir = BASE_DIR / "front-end" / "pages"
css_dir   = BASE_DIR / "front-end" / "cssFiles"
js_dir    = BASE_DIR / "front-end" / "scriptFiles"

# When initially start, it will make get request to root which will return login.html
@app.get("/")
async def read_root():
    return FileResponse(pages_dir / "loginPage.html")

#Basically the mount will make a psuedo directory which is equivalent to our file structure
# Example : instead of "/front-end/pages/home.html" it will be "/static/pages/home.html"


#These @app.get() will return path if API sent a GET request for these items

@app.get("/home.html")
def home_page():
    return FileResponse(pages_dir / "home.html")


# These doesn't work with <link> or <script src> in html
# We change the href/src with '/static' path instead

# @app.get("/home.css")
# def home_page():
#     return FileResponse(css_dir / "home.css")

# @app.get("/home.js")
# def home_page():
#     return FileResponse(js_dir / "home.js")



#I think this work (?)
@app.get("/back-end/data/userData.json")
def usedata():
    return FileResponse(backend_path / "data" / "userData.json")



def get_db(): #get the dabase
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#testing to create register path

# @app.post("/register")
# def register(user: User):
#     return {"message": f"User {user.username} registered!"}

@app.post("/register") #create the path http:/register
def register(user: User, db: Session = Depends(get_db)):
    existing_user = db.query(UserDB).filter(UserDB.username == user.username).first() #check if username exist
    if existing_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    #create new user
    new_user = UserDB(username = user.username,password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created, jump to main screen"}

@app.post("/login")
def login(user:User, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.username == user.username,
                                      UserDB.password == user.password).first()
    
    if db_user:
        return {"message":f"Login sucessful for {user.username}"}
    else:
        raise HTTPException(status_code=400, detail="Invalid username or password")


@app.post("/api/compile")
async def callingCompile(compile:Compile):
    try:
        # This is non-blocking
        token = await submit_code(compile.langID, compile.srcCode)
        
        while True:
            # This is non-blocking
            result = await get_result(token)
            
            status_id = result['status']['id']
            
            # Status 1 (In Queue) or 2 (Processing)
            if status_id == 1 or status_id == 2:
                await asyncio.sleep(1)
            
            # Status 3 = Accepted (Done!)
            elif status_id == 3:
                stdout = result.get('stdout')
                if stdout:
                    output = base64.b64decode(stdout.encode('utf-8')).decode('utf-8')
                    return {
                        "id":1,
                        "output": output
                        }
                else:
                    return {
                        "id":1,
                        "output": output
                        }
            else:
                stderr = result.get('stderr')
                error_desc = result['status']['description']
                if stderr:
                    error = base64.b64decode(stderr.encode('utf-8')).decode('utf-8')
                    return {"id":0,"error": error, "details": error_desc}
                else:
                    return {"id":0,"error": error_desc}
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/check_quiz/{username}/{quiz_id}")
def check_quiz(username: str, quiz_id: str, db: Session = Depends(get_db)):
    # Check if a row exists for this user + this quiz
    progress = db.query(QuizProgress).filter(
        QuizProgress.username == username,
        QuizProgress.quiz_id == quiz_id
    ).first()
    
    if progress:
        return {"status": True}
    return {"status": False}


@app.post("/mark_quiz_done/{username}/{quiz_id}")
def mark_quiz_done(username: str, quiz_id: str, db: Session = Depends(get_db)):
    # Check if already exists to avoid duplicates
    existing = db.query(QuizProgress).filter(
        QuizProgress.username == username,
        QuizProgress.quiz_id == quiz_id
    ).first()
    
    if not existing:
        new_progress = QuizProgress(username=username, quiz_id=quiz_id, is_completed=True)
        db.add(new_progress)
        db.commit()
        
    return {"message": "Marked as done"}
