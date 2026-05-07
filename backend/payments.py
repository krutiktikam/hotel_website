import stripe
import os
from .models import Booking
from sqlalchemy.orm import Session

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

def create_checkout_session(booking: Booking):
    """
    Creates a Stripe Checkout Session for a booking.
    """
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'Room Booking: {booking.room_type}',
                        'description': f'Guest: {booking.customer_name} | {booking.check_in} to {booking.check_out}',
                    },
                    'unit_amount': int(booking.total_price * 100), # Stripe expects amounts in cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{os.getenv("FRONTEND_URL", "http://localhost:3000")}/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{os.getenv("FRONTEND_URL", "http://localhost:3000")}/cancel',
            metadata={
                'booking_id': str(booking.id)
            }
        )
        return session
    except Exception as e:
        print(f"Error creating Stripe session: {e}")
        return None

def handle_stripe_webhook(payload, sig_header):
    """
    Handles Stripe webhooks to confirm payment.
    """
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        return None, "Invalid payload"
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return None, "Invalid signature"

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        booking_id = session.get('metadata', {}).get('booking_id')
        return booking_id, None
    
    return None, "Unhandled event type"
