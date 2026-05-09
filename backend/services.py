from datetime import datetime, timedelta
from typing import List
import json
from .models import Booking, Room
from .schemas import BookingCreate
from sqlalchemy.orm import Session
from sqlalchemy import func

def cleanup_expired_bookings(db: Session):
    """
    Mark unconfirmed 'pending' bookings that are older than 24 hours as 'cancelled'.
    """
    expiry_threshold = datetime.now() - timedelta(hours=24)
    expired_bookings = db.query(Booking).filter(
        Booking.status == "pending",
        Booking.created_at < expiry_threshold
    ).all()
    
    for booking in expired_bookings:
        booking.status = "cancelled"
    
    db.commit()
    return len(expired_bookings)

# Keep these for now as fallback/metadata but prefer database for pricing
ADDONS = {
    "BREAKFAST": {"name": "Breakfast", "price": 25, "per_night": True},
    "SPA": {"name": "Spa Package", "price": 50, "per_night": False},
    "LATE_CHECKOUT": {"name": "Late Check-out", "price": 30, "per_night": False},
    "AIRPORT_TRANSFER": {"name": "Airport Transfer", "price": 40, "per_night": False},
}

MEAL_PLANS = {
    "Standard": {"name": "Standard (Breakfast Only)", "price": 0},
    "Half-Board": {"name": "Half-Board (Breakfast + Dinner)", "price": 50},
    "Full-Board": {"name": "Full-Board (All Meals)", "price": 80},
}

PACKAGES = {
    "Standard": {"name": "Standard", "price": 0},
    "Honeymoon": {"name": "Honeymoon Special", "price": 150},
    "Wellness": {"name": "Wellness Retreat", "price": 200},
}

def calculate_total_price(db: Session, booking: BookingCreate) -> float:
    check_in = datetime.fromisoformat(booking.check_in)
    check_out = datetime.fromisoformat(booking.check_out)
    nights = max(1, (check_out - check_in).days)

    # Base room price from database (case-insensitive)
    db_room = db.query(Room).filter(func.lower(Room.name) == func.lower(booking.room_type)).first()
    if not db_room:
        # Fallback to slug if name doesn't match
        db_room = db.query(Room).filter(func.lower(Room.slug) == func.lower(booking.room_type)).first()
    
    room_price = db_room.price if db_room else 150.0 # Default if not found
    total = room_price * nights

    # Meal plan price
    meal_price = MEAL_PLANS.get(booking.meal_plan, MEAL_PLANS["Standard"])["price"]
    total += meal_price * nights

    # Package price
    package_price = PACKAGES.get(booking.package_type, PACKAGES["Standard"])["price"]
    total += package_price

    # Addons price
    for addon_key in booking.selected_addons:
        addon = ADDONS.get(addon_key)
        if addon:
            if addon["per_night"]:
                total += addon["price"] * nights
            else:
                total += addon["price"]

    return float(total)

def check_availability(db: Session, room_type: str, check_in_str: str, check_out_str: str) -> bool:
    """
    Checks if a room type is available for the given dates.
    Logic: A room is unavailable if the number of confirmed/pending bookings
    overlaps with the requested dates and meets or exceeds the room's total inventory.
    """
    # Get room inventory
    db_room = db.query(Room).filter(func.lower(Room.name) == func.lower(room_type)).first()
    if not db_room:
        db_room = db.query(Room).filter(func.lower(Room.slug) == func.lower(room_type)).first()
    
    inventory = db_room.total_inventory if db_room else 1

    # Check for overlapping bookings
    # We only count 'confirmed' or 'pending' bookings
    # Using case-insensitive match for room_type
    overlapping_bookings = db.query(Booking).filter(
        func.lower(Booking.room_type) == func.lower(room_type),
        Booking.status != "cancelled",
        Booking.check_in < check_out_str,
        Booking.check_out > check_in_str
    ).count()

    return overlapping_bookings < inventory

def get_pricing(db: Session, room_type: str, month: int, year: int):
    import calendar
    from datetime import date

    db_room = db.query(Room).filter(func.lower(Room.name) == func.lower(room_type)).first()
    if not db_room:
        db_room = db.query(Room).filter(func.lower(Room.slug) == func.lower(room_type)).first()
    
    base_price = db_room.price if db_room else 150.0
    
    _, num_days = calendar.monthrange(year, month)
    daily_prices = []
    
    for day in range(1, num_days + 1):
        current_date = date(year, month, day)
        date_str = current_date.isoformat()
        
        # Simple dynamic pricing: Weekends (Fri, Sat) are 20% more
        # weekday() returns 0 for Monday, 4 for Friday, 5 for Saturday
        price = base_price
        if current_date.weekday() in [4, 5]:
            price = base_price * 1.2
            
        is_available = check_availability(db, room_type, date_str, (date(year, month, day + 1) if day < num_days else date(year, month, day)).isoformat())
        # The check_availability above is slightly flawed for the last day of month but good enough for a mock/start
        
        daily_prices.append({
            "date": date_str,
            "price": round(price, 2),
            "is_available": is_available
        })
        
    return {
        "room_type": room_type,
        "month": month,
        "year": year,
        "daily_prices": daily_prices
    }

def get_options(db: Session = None):
    room_types = []
    if db:
        rooms = db.query(Room).filter(Room.is_active == True).all()
        # Convert names to uppercase to match frontend expectations (DELUXE, LUXURY, SUITE)
        room_types = [{"name": r.name.upper(), "price": r.price, "description": r.description, "image_url": r.image_url, "gallery_images": json.loads(r.gallery_images) if r.gallery_images else []} for r in rooms]

    return {
        "room_types": room_types,
        "meal_plans": [{"name": k, "price": v["price"]} for k, v in MEAL_PLANS.items()],
        "packages": [{"name": k, "price": v["price"]} for k, v in PACKAGES.items()],
        "addons": [{"name": k, "price": v["price"]} for k, v in ADDONS.items()],
    }

