# --- API KEY ROTATION & MULTI-KEY SUPPORT ---
def get_api_keys():
    keys_str = os.getenv("GEMINI_API_KEYS", "")
    keys = [k.strip() for k in keys_str.split(",") if k.strip()]
    if not keys:
        primary = os.getenv("GEMINI_API_KEY")
        if primary:
            keys.append(primary)
        for i in range(2, 6):
            k = os.getenv(f"GEMINI_API_KEY_{i}")
            if k:
                keys.append(k)
    return keys

api_keys = get_api_keys()
current_key_index = 0

def configure_model():
    global current_key_index, api_keys
    if not api_keys:
        api_keys = get_api_keys()
    if api_keys:
        key = api_keys[current_key_index % len(api_keys)]
        genai.configure(api_key=key)
    return genai.GenerativeModel("models/gemini-2.5-flash")

def rotate_key():
    global current_key_index, api_keys
    if not api_keys:
        api_keys = get_api_keys()
    if len(api_keys) > 1:
        current_key_index = (current_key_index + 1) % len(api_keys)
        print(f"API Key Rate Limit hit. Rotating to API Key #{current_key_index + 1}...")
        genai.configure(api_key=api_keys[current_key_index])

model = configure_model()

def parse_json_response(response_text):
    text = response_text.strip()
    if text.startswith("```json"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()
    return json.loads(text)

def generate_learning_roadmap(goal, skills, duration, context=""):
    prompt = f"""
    Create a highly detailed, professional 3-month learning roadmap.
    
    Context: {context}

    Goal: {goal}
    Current Skills: {skills}
    Duration: 3 months

    CRITICAL RULES:
    - The "months" array MUST have EXACTLY 3 objects (month 1, month 2, month 3).
    - Each month MUST have at least 4 topics and 1 project.
    - Never output fewer than 3 months.

    Return ONLY valid JSON matching this exact structure:
    {{
       "goal":"{goal}",
       "months":[
       {{
           "month":1,
           "title": "Foundations & Basics",
           "topics":[
                {{"id": "t1", "name": "Topic Name", "estimated_hours": 15, "difficulty": "Beginner"}},
                {{"id": "t2", "name": "Topic Name", "estimated_hours": 10, "difficulty": "Beginner"}},
                {{"id": "t3", "name": "Topic Name", "estimated_hours": 12, "difficulty": "Beginner"}},
                {{"id": "t4", "name": "Topic Name", "estimated_hours": 10, "difficulty": "Beginner"}}
           ],
           "projects":[
                {{"id": "p1", "title": "Project Title", "difficulty": "Beginner", "technologies": ["Tech1"], "estimated_time": "1 week"}}
           ],
           "resources":[
                {{"id": "r1", "title": "Resource Title", "type": "course", "url": "https://..."}}
           ]
       }},
       {{
           "month":2,
           "title": "Intermediate Skills",
           "topics":[ ... at least 4 topics ... ],
           "projects":[ ... at least 1 project ... ],
           "resources":[ ... ]
       }},
       {{
           "month":3,
           "title": "Advanced Mastery & Specialization",
           "topics":[ ... at least 4 topics ... ],
           "projects":[ ... at least 1 project ... ],
           "resources":[ ... ]
       }}
       ]
    }}
    Do not include markdown. Do not include explanations. Do not output fewer than 3 months.
    """
    try:
        response = model.generate_content(prompt)
        return parse_json_response(response.text)
    except Exception as e:
        if "429" in str(e) or "quota" in str(e):
            rotate_key()
            try:
                response = model.generate_content(prompt)
                return parse_json_response(response.text)
            catch_err = None
        print("Gemini API Exception for Roadmap (using fallback):", e)
        return {
            "goal": goal,
            "months": [
                {
                    "month": 1,
                    "title": f"{goal} Foundations & Core Concepts",
                    "topics": [
                        {"id": "t1_1", "name": f"Introduction to {goal}", "estimated_hours": 15, "difficulty": "Beginner"},
                        {"id": "t1_2", "name": "Environment & Tooling Setup", "estimated_hours": 10, "difficulty": "Beginner"},
                        {"id": "t1_3", "name": "Core Principles & Fundamentals", "estimated_hours": 15, "difficulty": "Beginner"},
                        {"id": "t1_4", "name": "Practical Exercises & Hands-on Lab", "estimated_hours": 10, "difficulty": "Beginner"}
                    ],
                    "projects": [
                        {"id": "p1_1", "title": f"Starter {goal} Project", "difficulty": "Beginner", "technologies": ["Python", "Git"], "estimated_time": "1 week"}
                    ],
                    "resources": [
                        {"id": "r1_1", "title": f"Official {goal} Guide & Docs", "type": "Website", "url": "https://docs.python.org"}
                    ]
                },
                {
                    "month": 2,
                    "title": f"{goal} Intermediate Skills & System Design",
                    "topics": [
                        {"id": "t2_1", "name": "Advanced Architecture & Workflows", "estimated_hours": 20, "difficulty": "Intermediate"},
                        {"id": "t2_2", "name": "API Integration & Data Handling", "estimated_hours": 25, "difficulty": "Intermediate"},
                        {"id": "t2_3", "name": "Testing & Debugging Strategies", "estimated_hours": 15, "difficulty": "Intermediate"},
                        {"id": "t2_4", "name": "Performance Tuning & Security", "estimated_hours": 10, "difficulty": "Intermediate"}
                    ],
                    "projects": [
                        {"id": "p2_1", "title": f"Intermediate {goal} Portfolio App", "difficulty": "Intermediate", "technologies": ["Python", "APIs", "Docker"], "estimated_time": "2 weeks"}
                    ],
                    "resources": [
                        {"id": "r2_1", "title": f"{goal} Comprehensive Masterclass", "type": "Course", "url": "https://coursera.org"}
                    ]
                },
                {
                    "month": 3,
                    "title": f"{goal} Advanced Specialization & Capstone",
                    "topics": [
                        {"id": "t3_1", "name": "Enterprise Scaling & High Availability", "estimated_hours": 20, "difficulty": "Hard"},
                        {"id": "t3_2", "name": "Security Hardening & Compliance", "estimated_hours": 20, "difficulty": "Hard"},
                        {"id": "t3_3", "name": "Automated Deployment & CI/CD", "estimated_hours": 15, "difficulty": "Hard"},
                        {"id": "t3_4", "name": "Real-world Production Monitoring", "estimated_hours": 15, "difficulty": "Hard"}
                    ],
                    "projects": [
                        {"id": "p3_1", "title": f"Production-Ready {goal} Capstone", "difficulty": "Hard", "technologies": ["Python", "Cloud", "Docker"], "estimated_time": "3 weeks"}
                    ],
                    "resources": [
                        {"id": "r3_1", "title": f"Advanced {goal} Architecture Patterns", "type": "Course", "url": "https://udemy.com"}
                    ]
                }
            ]
        }

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
    try:
        response = model.generate_content(prompt)
        return parse_json_response(response.text)
    except Exception as e:
        print(f"Gemini API Exception for Quiz ({topic}):", e)
        return {
            "topic": topic,
            "questions": [
                {
                    "id": "q1",
                    "type": "mcq",
                    "question": f"What is the primary core objective when learning {topic}?",
                    "options": [
                        f"Establishing foundational principles and best practices of {topic}",
                        "Executing random unverified code without testing",
                        "Bypassing standard security protocols",
                        "None of the above"
                    ],
                    "answer": "A",
                    "explanation": f"Understanding the core principles and workflows of {topic} is essential for building scalable applications."
                },
                {
                    "id": "q2",
                    "type": "mcq",
                    "question": f"Which of the following is considered an industry best practice for {topic}?",
                    "options": [
                        "Ignoring documentation and edge cases",
                        "Modular design, clear naming, and structured validation",
                        "Hardcoding all configurations into a single script",
                        "Skipping testing and error handling"
                    ],
                    "answer": "B",
                    "explanation": f"Modular design and validation ensure reliable implementation when working with {topic}."
                },
                {
                    "id": "q3",
                    "type": "mcq",
                    "question": f"What is a common challenge encountered when deploying {topic} in production?",
                    "options": [
                        "Managing state, latency, and resource constraints",
                        "Running out of memory on basic hello world programs",
                        "Lack of internet connectivity across all servers",
                        "Excessive compilation speed"
                    ],
                    "answer": "A",
                    "explanation": f"Latency, resource allocation, and state management are key engineering considerations in {topic}."
                },
                {
                    "id": "q4",
                    "type": "mcq",
                    "question": f"How do modern frameworks simplify development in {topic}?",
                    "options": [
                        "By abstracting boilerplate code and standardizing interfaces",
                        "By requiring manual machine code assembly",
                        "By eliminating the need for underlying hardware",
                        "By disabling debugging tools"
                    ],
                    "answer": "A",
                    "explanation": f"Modern tooling for {topic} abstracts boilerplate code and provides clean abstractions."
                },
                {
                    "id": "q5",
                    "type": "mcq",
                    "question": f"In production systems, how should error handling for {topic} be implemented?",
                    "options": [
                        "Graceful degradation with comprehensive logging and retries",
                        "Swallowing exceptions silently without logs",
                        "Crashing the entire system immediately",
                        "Displaying raw tracebacks to end users"
                    ],
                    "answer": "A",
                    "explanation": "Graceful degradation and structured logging ensure robust system reliability."
                }
            ]
        }

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
    try:
        response = model.generate_content(prompt)
        return parse_json_response(response.text)
    except Exception as e:
        print(f"Gemini API Exception for Flashcards ({topic}):", e)
        return {
            "topic": topic,
            "notes": f"### Overview of {topic}\n\n{topic} is a key topic in your learning path. Key areas include core concepts, practical implementation, and performance optimization.",
            "flashcards": [
                {
                    "front": f"What is the core definition of {topic}?",
                    "back": f"{topic} represents the foundational concepts, tools, and techniques needed to design efficient systems."
                },
                {
                    "front": f"Key component of {topic}?",
                    "back": "Architecture design, modular code structure, and efficient data handling."
                },
                {
                    "front": f"Why is {topic} critical in modern development?",
                    "back": "It enables scalable implementation, reduces operational errors, and optimizes overall execution speed."
                },
                {
                    "front": f"Best practice in {topic}?",
                    "back": "Follow structured workflows, enforce automated testing, and use standardized configurations."
                },
                {
                    "front": f"Common mistake to avoid in {topic}?",
                    "back": "Over-complicating architecture early on and ignoring security or performance edge cases."
                }
            ],
            "mind_map": [
                {"node": topic, "children": ["Foundations", "Implementation", "Best Practices", "Deployment"]}
            ]
        }

def chat_with_ai(message, history=[], context=""):
    try:
        chat = model.start_chat(history=history)
        prompt = f"""
        You are an AI OS Learning Path Assistant. 
        Context from Knowledge Base: {context}
        
        User message: {message}
        """
        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        print("Gemini API Exception for Chat:", e)
        clean_name = message.replace('Explain "', '').split('"')[0] if '"' in message else "this topic"
        return f"### Explanation of {clean_name}\n\n" \
               f"**Key Concepts**:\n" \
               f"* **Definition**: {clean_name} is a fundamental module in your current learning roadmap.\n" \
               f"* **Core Principles**: Understanding the core principles, syntax, and workflows of {clean_name} is essential for building production-ready applications.\n" \
               f"* **Practical Application**: You can practice {clean_name} by working on hands-on exercises, configuring modular components, and testing edge cases.\n\n" \
               f"*Note: Gemini API Free Tier rate limit reached. Full live AI explanations will automatically resume when the rate limit quota resets.*"