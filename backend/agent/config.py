import os

API_BASE_URL = os.getenv("ASKFOOTBALL_API_URL", "http://localhost:8000")
API_KEY = os.getenv("ASKFOOTBALL_API_KEY", "dev-key-change-in-production")

API_HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}
