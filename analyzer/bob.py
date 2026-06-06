import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def explain_impact(changed_file, affected_files):
    """
    Changed file aur affected files leta hai —
    Groq AI se plain English explanation maangta hai.
    """

    if not affected_files:
        return "No impact detected — this file has no dependents."

    prompt = f"""
    You are an expert software engineer reviewing code changes.
    
    A developer is about to change: {changed_file}
    
    This change will affect these files: {', '.join(affected_files)}
    
    Please explain:
    1. Why these files are likely affected
    2. What could break specifically
    3. What the developer should check before making this change
    
    Keep explanation clear, concise, and helpful.
    Use simple language — not every developer is senior.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content