import google.generativeai as genai
import os
genai.configure(api_key="GEMINI_API_KEY")
model = genai.GenerativeModel("models/gemini-2.5-flash")

def generate_learning_roadmap(goal,skills,duration):
    prompt = f"""
    Create a professional learning roadmap.

    Goal: {goal}
    Current Skills: {skills}
    Duration: {duration}

    Requirements:
    -Divide into months
    -Mention topics to learn
    -Mention projects
    -Mention resources
    -Mention milestones
    -Use markdown formatting

    Generate a detailed roadmap
    """

    response = model.generate_content(prompt)
    return response.text