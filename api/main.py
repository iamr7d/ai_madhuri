from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import os
import sys
import json
import logging
from datetime import datetime
from pathlib import Path
import requests
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI(
    title="AI Radio Studio API",
    description="Backend API for AI Radio Studio application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScriptRequest(BaseModel):
    type: str = Field(..., description="Type of script to generate: intro, track_intro, weather, or news")
    track_info: Optional[Dict[str, str]] = Field(None, description="Information about the track for track introductions")
    prompt_override: Optional[str] = Field(None, description="Custom prompt to override default generation")

class AudioRequest(BaseModel):
    text: str = Field(..., description="Text to convert to speech")
    voice_id: Optional[str] = Field("shruthi", description="Voice ID for text-to-speech")
    emotion: Optional[str] = Field("cheerful", description="Emotion style for the speech")

class WeatherResponse(BaseModel):
    temperature: float
    description: str
    humidity: int
    windSpeed: float

class NewsItem(BaseModel):
    title: str
    timestamp: str
    source: str

def get_current_time():
    return datetime.now().strftime("%I:%M %p")

def get_time_based_greeting():
    hour = datetime.now().hour
    if hour < 12:
        return "Good morning"
    elif 12 <= hour < 17:
        return "Good afternoon"
    elif 17 <= hour < 22:
        return "Good evening"
    else:
        return "Hello night owls"

def generate_text(prompt: str) -> str:
    try:
        # Add specific formatting instructions to the prompt
        formatted_prompt = f"""
        {prompt}
        
        Important formatting rules:
        1. Do not use any special characters or markdown
        2. Write naturally as spoken text
        3. Keep sentences clear and concise
        4. Use only basic punctuation (periods, commas, question marks)
        5. Avoid abbreviations except for common ones
        6. Write numbers as they should be spoken
        7. No line breaks or multiple spaces
        """
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": formatted_prompt,
                }
            ],
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=200,
        )
        
        generated_text = chat_completion.choices[0].message.content
        
        # Clean up the text
        generated_text = generated_text.replace('\n', ' ').strip()
        generated_text = ' '.join(generated_text.split())  # Remove extra spaces
        
        return generated_text
        
    except Exception as e:
        logger.error(f"Error generating text: {e}")
        return "I'm sorry, I couldn't generate the commentary at this time."

@app.post("/api/generate-script", response_model=Dict[str, str])
async def generate_script(request: ScriptRequest, background_tasks: BackgroundTasks):
    try:
        logger.info(f"Generating script of type: {request.type}")
        
        if request.prompt_override:
            script = generate_text(request.prompt_override)
            return {"script": script}

        current_time = get_current_time()
        greeting = get_time_based_greeting()

        if request.type == "intro":
            prompt = f"""
            Act as RJ Shruthi, a vibrant student radio jockey at Digital University Kerala.
            Current time: {current_time}
            Create a short, energetic radio show intro starting with "{greeting}!"
            Keep it brief (2-3 sentences) and mention we're live on Techno Tunes at dee yu kay college FM.
            Make it youthful and engaging.
            """
        elif request.type == "track_intro" and request.track_info:
            prompt = f"""
            As RJ Shruthi, create a brief and exciting introduction for the next song.
            Current time: {current_time}
            Song details:
            - Title: {request.track_info.get('name', 'Unknown')}
            - Artist: {request.track_info.get('artists', 'Unknown Artist')}
            - Album: {request.track_info.get('album', 'Unknown Album')}
            Keep it natural and conversational, like a college RJ speaking to friends.
            """
        elif request.type == "weather":
            weather = await weather()
            prompt = f"""
            As RJ Shruthi, deliver a quick weather update for our college campus.
            Current time: {current_time}
            Weather information: The current temperature is {weather['weather']['temperature']}°C with {weather['weather']['description']}.
            Make it sound casual and relevant to student life.
            """
        else:
            prompt = f"""
            As RJ Shruthi, create a casual radio segment transition.
            Current time: {current_time}
            Keep it brief and engaging, mentioning we're live on Techno Tunes at DUK College FM.
            """

        script = generate_text(prompt)
        return {"script": script}
    except Exception as e:
        logger.error(f"Error generating script: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/text-to-speech")
async def text_to_speech(request: AudioRequest, background_tasks: BackgroundTasks):
    try:
        logger.info(f"Converting text to speech: {request.text[:50]}...")
        # For now, return a mock audio response
        return {
            "audio_data": "mock_audio_data",
            "duration": 3.5
        }
    except Exception as e:
        logger.error(f"Error in text-to-speech: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/weather", response_model=Dict[str, WeatherResponse])
async def weather():
    try:
        # Mock weather data for now
        weather_data = {
            "weather": {
                "temperature": 25.5,
                "description": "partly cloudy",
                "humidity": 65,
                "windSpeed": 3.5
            }
        }
        return weather_data
    except Exception as e:
        logger.error(f"Error fetching weather: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news", response_model=Dict[str, List[NewsItem]])
async def news():
    try:
        # Mock news data for now
        news_data = {
            "news": [
                {
                    "title": "Local college radio station launches new AI-powered show",
                    "timestamp": datetime.now().isoformat(),
                    "source": "College News"
                }
            ]
        }
        return news_data
    except Exception as e:
        logger.error(f"Error fetching news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
