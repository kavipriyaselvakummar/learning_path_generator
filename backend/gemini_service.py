import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

print("API KEY =", os.getenv("GEMINI_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash")

def parse_json_response(response_text):
    text = response_text.strip()
    if text.startswith("```json"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()
    return json.loads(text)

def generate_learning_roadmap(goal, skills, duration, context=""):
    prompt = f"""
    Create a professional learning roadmap.
    
    Context: {context}

    Goal: {goal}
    Current Skills: {skills}
    Duration: {duration}

    Return ONLY valid JSON.
    Format:
    {{
       "goal":"{goal}",
       "months":[
       {{
           "month":1,
           "topics":[
                {{"id": "t1", "name": "Topic 1", "estimated_hours": 10, "difficulty": "Beginner"}}
           ],
           "projects":[
                {{"id": "p1", "title": "Project 1", "difficulty": "Beginner", "technologies": ["HTML"], "estimated_time": "1 week"}}
           ],
           "resources":[
                {{"id": "r1", "title": "Resource 1", "type": "course", "url": "https://..."}}
           ]
       }}
       ]
    }}
    Do not include markdown. Do not include explanations.
    """
    response = model.generate_content(prompt)
    try:
        return parse_json_response(response.text)
    except Exception as e:
        print("JSON ERROR:", e)
        raise e

def generate_quiz(topic, context=""):
    prompt = f"""
    Generate a quiz of 5 questions (MCQs and coding/scenario) for the topic: {topic}.
    Use context if available: {context}
    
    Return ONLY valid JSON. Format:
    {{
       "topic": "{topic}",
       "questions": [
          {{
              "id": "q1",
              "type": "mcq",
              "question": "What is...",
              "options": ["A", "B", "C", "D"],
              "answer": "A",
              "explanation": "Because..."
          }}
       ]
    }}
    Do not include markdown or explanations outside the JSON.
    """
    response = model.generate_content(prompt)
    try:
        return parse_json_response(response.text)
    except Exception as e:
        print("JSON ERROR:", e)
        raise e

def generate_notes(topic, context=""):
    prompt = f"""
    Generate detailed notes, flashcards, and a mind map structure for the topic: {topic}.
    Use context if available: {context}
    
    Return ONLY valid JSON. Format:
    {{
       "topic": "{topic}",
       "notes": "Detailed markdown text...",
       "flashcards": [
          {{"front": "concept", "back": "definition"}}
       ],
       "mind_map": [
          {{"node": "Root", "children": ["Child1", "Child2"]}}
       ]
    }}
    Do not include markdown or explanations outside the JSON.
    """
    response = model.generate_content(prompt)
    try:
        return parse_json_response(response.text)
    except Exception as e:
        print("JSON ERROR:", e)
        raise e

def chat_with_ai(message, history=[], context=""):
    # History would be a list of dicts: [{{"role": "user", "parts": "msg"}}, {{"role": "model", "parts": "reply"}}]
    chat = model.start_chat(history=history)
    
    prompt = f"""
    You are an AI OS Learning Path Assistant. 
    Context from Knowledge Base: {context}
    
    User message: {message}
    """
    
    response = chat.send_message(prompt)
    return response.text