from datetime import datetime
from typing import List
import json
from .models import Booking
from .schemas import BookingCreate
from sqlalchemy.orm import Session

ROOM_TYPES = {
    "LUXURY": {"name": "Luxury", "price": 300},
    "SUITE": {"name": "Suite", "price": 200},
    "DELUXE": {"name": "Deluxe", "price": 150},
}

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

def calculate_total_price(booking: BookingCreate) -> float:
    check_in = datetime.fromisoformat(booking.check_in)
    check_out = datetime.fromisoformat(booking.check_out)
    nights = max(1, (check_out - check_in).days)

    # Base room price
    room_price = ROOM_TYPES.get(booking.room_type, ROOM_TYPES["DELUXE"])["price"]
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
    # Always return True for testing/demo purposes
    return True

def get_options():
    return {
        "room_types": [{"name": k, "price": v["price"]} for k, v in ROOM_TYPES.items()],
        "meal_plans": [{"name": k, "price": v["price"]} for k, v in MEAL_PLANS.items()],
        "packages": [{"name": k, "price": v["price"]} for k, v in PACKAGES.items()],
        "addons": [{"name": k, "price": v["price"]} for k, v in ADDONS.items()],
    }
