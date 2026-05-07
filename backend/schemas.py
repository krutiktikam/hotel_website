from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class BookingBase(BaseModel):
    customer_name: str
    customer_phone: str
    room_type: str
    check_in: str
    check_out: str
    meal_plan: Optional[str] = "Standard"
    package_type: Optional[str] = "Standard"
    special_requests: Optional[str] = None
    selected_addons: List[str] = []

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    total_price: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AvailabilityRequest(BaseModel):
    room_type: str
    check_in: str
    check_out: str

class AvailabilityResponse(BaseModel):
    is_available: bool

class OptionItem(BaseModel):
    name: str
    price: float
    description: Optional[str] = None

class OptionsResponse(BaseModel):
    room_types: List[OptionItem]
    meal_plans: List[OptionItem]
    packages: List[OptionItem]
    addons: List[OptionItem]

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class RoomBase(BaseModel):
    name: str
    slug: str
    description: str
    price: float
    size: str
    guests: str
    features: List[str]
    image_url: str
    is_active: bool = True

class RoomCreate(RoomBase):
    pass

class RoomResponse(RoomBase):
    id: int
    class Config:
        from_attributes = True

class ExperienceBase(BaseModel):
    title: str
    category: str
    description: str
    price: float
    duration: str
    image_url: str
    icon_name: str

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: int
    class Config:
        from_attributes = True

class GalleryImageBase(BaseModel):
    url: str
    category: str
    span_class: str = ""

class GalleryImageCreate(GalleryImageBase):
    pass

class GalleryImageResponse(GalleryImageBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    message: str
