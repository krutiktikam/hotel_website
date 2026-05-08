import httpx
import os
import logging
from typing import Optional
from .models import Booking
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# Meta WhatsApp Cloud API Configuration
WHATSAPP_VERSION = "v22.0"

async def send_whatsapp_confirmation(booking: Booking):
    """
    Sends a WhatsApp confirmation message using Meta Cloud API.
    """
    whatsapp_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    
    deposit_amount = booking.total_price * 0.10

    # Always print a summary to the console for easier debugging/verification
    print(f"--- BOOKING NOTIFICATION SUMMARY ---")
    print(f"To: {booking.customer_phone}")
    print(f"Guest: {booking.customer_name}")
    print(f"Room: {booking.room_type}")
    print(f"Dates: {booking.check_in} to {booking.check_out}")
    print(f"Total Price: ${booking.total_price:.2f}")
    print(f"Required 10% Deposit: ${deposit_amount:.2f}")
    print(f"------------------------------------")

    if not whatsapp_token or not phone_number_id:
        logger.warning("WhatsApp credentials not found. Using console mock only.")
        return {"status": "mocked"}

    url = f"https://graph.facebook.com/{WHATSAPP_VERSION}/{phone_number_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {whatsapp_token}",
        "Content-Type": "application/json"
    }
    
    # Clean phone number: remove any non-digit characters
    clean_phone = "".join(filter(str.isdigit, booking.customer_phone))

    # Payload for Meta WhatsApp Cloud API Template
    payload = {
        "messaging_product": "whatsapp",
        "to": clean_phone,
        "type": "template",
        "template": {
            "name": "booking_confirmation", 
            "language": {
                "code": "en"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {"type": "text", "text": str(booking.customer_name)},
                        {"type": "text", "text": str(booking.room_type)},
                        {"type": "text", "text": str(booking.check_in)},
                        {"type": "text", "text": str(booking.check_out)},
                        {"type": "text", "text": f"Total: ${booking.total_price:.2f} | 10% Deposit: ${deposit_amount:.2f}"}
                    ]
                }
            ]
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print(f"DEBUG: Sending request to Meta URL: {url}")
            response = await client.post(url, json=payload, headers=headers)
            response_data = response.json()
            print(f"DEBUG: Meta Response Status: {response.status_code}")
            print(f"DEBUG: Meta Response Data: {response_data}")
            
            if response.status_code != 200:
                print(f"Failed to send WhatsApp message: {response_data}")
                return {"status": "error", "detail": response_data}
                
            print(f"WhatsApp message sent: {response_data}")
            return {"status": "success", "message_id": response_data.get("messages", [{}])[0].get("id")}
            
        except Exception as e:
            print(f"Unexpected error sending WhatsApp: {str(e)}")
            return {"status": "error", "detail": str(e)}
