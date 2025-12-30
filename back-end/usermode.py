from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

class Compile(BaseModel):
    langID: int
    srcCode: str
    stdin: str | None = None