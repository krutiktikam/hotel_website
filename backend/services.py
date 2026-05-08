from datetime import datetime
from typing import List
import json
from .models import Booking, Room
from .schemas import BookingCreate
from sqlalchemy.orm import Session
from sqlalchemy import func

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
    Logic: A room is unavailable if there's a booking for that room type where:
    (existing_check_in < requested_check_out) AND (existing_check_out > requested_check_in)
    """
    # Check for overlapping bookings
    # We only count 'confirmed' or 'pending' bookings
    overlapping_bookings = db.query(Booking).filter(
        Booking.room_type == room_type,
        Booking.status != "cancelled",
        Booking.check_in < check_out_str,
        Booking.check_out > check_in_str
    ).count()

    # For now, we assume 1 room per type exists (as per simple seed)
    # In a more advanced system, we'd compare against 'Room.count'
    return overlapping_bookings == 0

def get_options():
    return {
        "room_types": [], # Frontend should fetch these from /api/v1/rooms now
        "meal_plans": [{"name": k, "price": v["price"]} for k, v in MEAL_PLANS.items()],
        "packages": [{"name": k, "price": v["price"]} for k, v in PACKAGES.items()],
        "addons": [{"name": k, "price": v["price"]} for k, v in ADDONS.items()],
    }
