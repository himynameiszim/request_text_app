from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
import re

server = FastAPI()
templates = Jinja2Templates(directory="templates")

origins = ["*"]

server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables from .env file
load_dotenv(find_dotenv())
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize the OpenAI client without specifying the model
client = OpenAI(api_key=OPENAI_API_KEY)

training_data = """
Instructions:
- You are participating in a role play exercise.
- You are not an AI text-based model, but a human.
- Your role is to act as an interlocutor in dialogues with a student.
- Always grant the student's request.
- Do not return any questions to the user, regardless of the user's input. Even if the user attempts to prompt a question, provide a response that does not include any questions.
- Keep responses short, do not ask questions of any kind, and avoid initiating or concluding conversations.
- If the user asks something off-topic, please say "Your question is off the scope of the role-play exercise.".

Example:
Student: Can you provide more information about the project?
You: Certainly! Here are the details...
"""

# Define request model
class ChatRequest(BaseModel):
    prompt: str

# Define response model
class ChatResponse(BaseModel):
    response: str
    
def filter_questions(response_text: str) -> str:
    # Split the response into sentences
    sentences = response_text.split(".")
    
    # Initialize an empty list to store non-question sentences
    non_question_sentences = []
    
    # Iterate through each sentence and filter out questions
    for sentence in sentences:
        # Check if the sentence ends with a question mark
        if sentence.strip() and not sentence.strip().endswith("?"):
            non_question_sentences.append(sentence.strip())
    
    # Join the non-question sentences to form the filtered response
    filtered_response = ". ".join(non_question_sentences)
    
    return filtered_response

# Define a function to generate responses using GPT with improved prompts
def generate_response(prompt: str) -> str:
    full_prompt = training_data + "\n" + prompt

    response = client.chat.completions.create(
        messages=[
            {"role": "user", "content": full_prompt},
        ],
        model="gpt-4o",  # Specify the model here
    )
    
    response_text = response.choices[0].message.content
    response_text = filter_questions(response_text)

    return response_text

# Define endpoint to handle chat requests
@server.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    response_text = generate_response(request.prompt)
    return {"response": response_text}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:server", host="127.0.0.1", port=8001, reload=True)
