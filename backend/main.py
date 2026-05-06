from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
import httpx
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Hotel Booking API")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Meta WhatsApp Cloud API Configuration
# These should be stored in environment variables for security
WHATSAPP_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN", "YOUR_ACCESS_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "YOUR_PHONE_NUMBER_ID")
WHATSAPP_VERSION = "v20.0"

class BookingConfirm(BaseModel):
    guest_name: str
    phone_number: str
    check_in_date: str

@app.post("/api/v1/booking/confirm")
async def confirm_booking(booking: BookingConfirm):
    """
    Sends a WhatsApp confirmation message using Meta Cloud API.
    """
    url = f"https://graph.facebook.com/{WHATSAPP_VERSION}/{PHONE_NUMBER_ID}/messages"
    
    # Meta API Authentication Headers:
    # Authorization: Bearer {token} - Your permanent or temporary access token
    # Content-Type: application/json - Standard for JSON payloads
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Payload for Meta WhatsApp Cloud API Template
    payload = {
        "messaging_product": "whatsapp",
        "to": booking.phone_number,
        "type": "template",
        "template": {
            "name": "beach_house_booking",
            "language": {
                "code": "en_US"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {"type": "text", "text": booking.guest_name},
                        {"type": "text", "text": booking.check_in_date}
                    ]
                }
            ]
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            response_data = response.json()
            
            # Log the response from Meta
            logger.info(f"Meta API Response: {response_data}")
            
            if response.status_code != 200:
                logger.error(f"Failed to send WhatsApp message: {response_data}")
                raise HTTPException(status_code=response.status_code, detail=response_data)
                
            return {"status": "success", "message_id": response_data.get("messages", [{}])[0].get("id")}
            
        except httpx.RequestError as exc:
            logger.error(f"An error occurred while requesting {exc.request.url!r}.")
            raise HTTPException(status_code=500, detail="External API connection error")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
