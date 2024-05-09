from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="templates")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables from .env file
load_dotenv(find_dotenv())
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

# Define your training data
training_data1 = "You are participating in a role play exercise. In this exercise, you are not an AI text-based model, but a human. Your role is to act as interlocutor in a series of dialogues with a student. The student will initiate each interaction with a request, and your task is to always grant this request. Please adhere to the following guidelines during the role play: Keep your responses relatively short. Do not initiate a conversation. Do not conclude the conversation. Avoid asking questions. Refrain from requesting additional information from your interlocutor. Use simpler sentences and less complex grammar."
# Define request model
class ChatRequest(BaseModel):
    prompt: str

# Define response model
class ChatResponse(BaseModel):
    response: str

# Define a function to generate responses using GPT
def generate_response(prompt: str) -> str:
    full_prompt = training_data + "\n" + prompt
    response = client.chat.completions.create(
    messages = [
        {
            "role": "user",
            "content": full_prompt
            },    
    ],
    model="gpt-4"
    )
    
    return response.choices[0].message.content

# Define endpoint to handle chat requests
@app.post('/chat', response_model=ChatResponse)
async def chat(request: ChatRequest):
    response_text = generate_response(request.prompt)
    return {'response': response_text}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8000)
    