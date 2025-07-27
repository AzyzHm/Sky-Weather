# Sky Weather App

Sky Weather is a simple and intuitive weather application built with FastAPI that provides real-time weather information using data from [OpenWeatherMap](https://openweathermap.org/).

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)
- [Project Status](#Project-Status)

## Technologies Used

- **Backend**: FastAPI (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **API**: [OpenWeatherMap API](https://openweathermap.org/api)
- **Server**: Uvicorn ASGI server

## Installation

1. Clone the repository:

```bash
git clone https://github.com/AzyzHm/Sky-Weather.git
cd Sky-Weather
```

2. Create a virtual environment (optional but recommended):

```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up your OpenWeatherMap API key:
   - Create a `.env` file in the project root
   - Add your API key: `OPENWEATHER_API_KEY=your-api-key-here`
   - Or use the default key provided (for testing only)

## Usage

1. Start the FastAPI server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. Open your browser and navigate to `http://localhost:8000`

3. Enter a city name and click "Search" to get weather information.

## API Endpoints

- `GET /` - Serves the main weather app interface
- `GET /weather/{city}` - Returns weather data for the specified city
- `GET /health` - Health check endpoint

### Example API Response

```json
{
  "country": "London, GB",
  "temperature": "15°C",
  "weather": "Clouds",
  "wind_speed": "3.5m/s",
  "humidity": "72%",
  "pressure": "1013hPa",
  "visibility": "10000m",
  "sunrise": "06:45:30",
  "sunset": "18:22:15",
  "timezone": "14:30:45"
}
```

## Screenshots

In the project's root directory, you can find a folder named `screenshots` that contains PNG images:

![Sky Weather App - Site Overview](/screenshots/overview.png)

*Caption: Site Overview.*

![Sky Weather App - Weather info of a given City](/screenshots/city-found.png)

*Caption: Weather info of a given City.*

![Sky Weather App - given city is not found](/screenshots/city-not-found.png)

*Caption: given city is not found.*

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Status

This project is actively maintained, and contributions are welcome. If you have any suggestions, feature requests, or bug reports, please open an issue or submit a pull request. Your input is valuable, and it will help make Sky Weather even better.