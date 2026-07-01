import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

print("API KEY =", os.getenv("GEMINI_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash")

def generate_learning_roadmap(goal,skills,duration):
    prompt = f"""
    Create a professional learning roadmap.

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
           "topics":[],
           "projects":[]
       }}
       ]
    }}

    Do not include markdown.
    Do not include explanations.
    Return only JSON.
    """

    response = model.generate_content(prompt)
    try:
       text = response.text.strip()
       if text.startswith("```json"):
           text = text.replace("```json","")
           text = text.replace("```","")
           text =text.strip()
       roadmap = json.loads(text)
       return roadmap
    except Exception as e:
        print("JSON ERROR:",e)
        print("RAW RESPONSE:")
        print(response.text)

        raise e