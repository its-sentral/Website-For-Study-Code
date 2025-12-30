#I added an .env file that won't appear in github, so please add .env with .gitignore to src directory

import base64
import httpx
import asyncio

#These are used in every file that require API key of that specific API
import os
from dotenv import load_dotenv

#Since normally you need to run code from CWD where the .env live
#We have to specify the path to .env file instead so we can load API key
script_dir = os.path.dirname(__file__)
project_root = os.path.abspath(os.path.join(script_dir, '..'))
dotenv_path = os.path.join(project_root, '.env')

load_dotenv(dotenv_path=dotenv_path)
#Load the API key for Judge0
API_KEY = os.environ.get("JUDGE_0_KEY")
#Check API key
if not API_KEY:
    print("Error: Could not find JUDGE_0_KEY")
else:
    print("Success! API key loaded.")

#All srcCode and stdin must be in Base64-encoded string format
async def submit_code(languageID:int,srcCode:str,stdin:str = None):
	url = "https://judge0-ce.p.rapidapi.com/submissions"

	querystring = {"base64_encoded":"true","wait":"false","fields":"*"}
	
	#Then we encode to utf-8 => encode to base64 => decode from utf-8
	#This will give us the encrypted data for src code and input
	payload = {
		"language_id": languageID,
		"source_code": base64.b64encode(srcCode.encode('utf-8')).decode('utf-8')
	}
	if stdin:
		payload["stdin"] = base64.b64encode(stdin.encode('utf-8')).decode('utf-8')

	#Setup header for API
	headers = {
		"x-rapidapi-key": API_KEY,
		"x-rapidapi-host": "judge0-ce.p.rapidapi.com",
		"Content-Type": "application/json"
	}
	#Send post submission which return a token for getting submission results
	async with httpx.AsyncClient() as client:
		response = await client.post(url, json=payload, headers=headers, params=querystring)
		response.raise_for_status()
	return response.json()['token']

#Above we have function for sending code to compile, this function use to fetch results
async def get_result(token:str):
	url = "https://judge0-ce.p.rapidapi.com/submissions/{t}".format(t=token)
	querystring = {"base64_encoded":"true","fields":"*"}

	headers = {
		"x-rapidapi-key": API_KEY,
		"x-rapidapi-host": "judge0-ce.p.rapidapi.com"
	}
	async with httpx.AsyncClient() as client:
			response = await client.get(url, headers=headers, params=querystring)
			response.raise_for_status()
	return response.json()
	