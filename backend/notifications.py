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
    print(f"Total Price: ₹{booking.total_price:.2f}")
    print(f"Required 10% Deposit: ₹{deposit_amount:.2f}")
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

    # Payload for Meta WhatsApp Cloud API Text Message
    # Refined for a professional, welcoming 'Coastal Minimalism' feel
    message_text = (
        f"🌊 *Namita Beach House | Sanctuary Confirmation*\n\n"
        f"Warm greetings {booking.customer_name},\n\n"
        f"Your retreat is officially reserved. We are preparing the {booking.room_type} for your arrival.\n\n"
        f"📅 *Stay Details:*\n"
        f"• Check-in: {booking.check_in} (10:00 AM)\n"
        f"• Check-out: {booking.check_out} (11:00 PM)\n\n"
        f"💳 *Investment Summary:*\n"
        f"• Total Stay: ₹{booking.total_price:.2f}\n"
        f"• Required 10% Deposit: ₹{deposit_amount:.2f}\n\n"
        f"Next Steps: Please provide a screenshot of your deposit to this chat to finalize your check-in rituals.\n\n"
        f"See you where the horizon meets the shore.\n"
        f"---"
    )

    payload = {
        "messaging_product": "whatsapp",
        "to": clean_phone,
        "type": "text",
        "text": {
            "body": message_text
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
