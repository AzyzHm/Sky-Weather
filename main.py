from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Sky Weather API", description="Weather app using FastAPI")

# Mount static files for images
app.mount("/pics", StaticFiles(directory="pics"), name="pics")

# API Key for OpenWeatherMap
API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main HTML page"""
    with open("index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

@app.get("/style.css")
async def get_css():
    """Serve the CSS file"""
    return FileResponse("style.css", media_type="text/css")

@app.get("/script.js")
async def get_js():
    """Serve the JavaScript file"""
    return FileResponse("script.js", media_type="application/javascript")

@app.get("/weather/{city}")
async def get_weather(city: str):
    """Get weather data for a specific city"""
    if not city.strip():
        raise HTTPException(status_code=400, detail="City name cannot be empty")
    
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get("cod") == "404":
            raise HTTPException(status_code=404, detail="City not found")
        
        # Process the data
        weather_data = {
            "country": f"{data['name']}, {data['sys']['country']}",
            "temperature": f"{round(data['main']['temp'] - 273.15)}°C",
            "weather": data['weather'][0]['main'],
            "wind_speed": f"{data['wind']['speed']}m/s",
            "humidity": f"{data['main']['humidity']}%",
            "pressure": f"{data['main']['pressure']}hPa",
            "visibility": f"{data['visibility']}m",
            "sunrise": datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M:%S'),
            "sunset": datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M:%S'),
            "timezone": datetime.fromtimestamp(data['dt']).strftime('%H:%M:%S')
        }
        
        return weather_data
        
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")
    except KeyError as e:
        raise HTTPException(status_code=500, detail=f"Invalid response from weather API: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Weather API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
