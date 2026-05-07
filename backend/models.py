from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from .database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    room_type = Column(String, nullable=False)
    check_in = Column(String, nullable=False)  # Storing as string ISO format for simplicity with SQLite
    check_out = Column(String, nullable=False)
    meal_plan = Column(String, default="Standard")
    package_type = Column(String, default="Standard")
    special_requests = Column(Text, nullable=True)
    addons = Column(Text, nullable=True)  # JSON stringified
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Integer, default=1)

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(Text)
    price = Column(Float)
    size = Column(String)
    guests = Column(String)
    features = Column(Text) # JSON string
    image_url = Column(String)
    is_active = Column(Boolean, default=True)

class Experience(Base):
    __tablename__ = "experiences"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    description = Column(Text)
    price = Column(Float)
    duration = Column(String)
    image_url = Column(String)
    icon_name = Column(String) # For lucide icon mapping

class GalleryImage(Base):
    __tablename__ = "gallery"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    category = Column(String)
    span_class = Column(String, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
