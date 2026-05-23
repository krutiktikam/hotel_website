from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class BookingBase(BaseModel):
    user_id: Optional[int] = None
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

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    room_type: Optional[str] = None

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
    guests: str
    features: List[str]
    image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = []
    total_inventory: int = 1
    is_active: bool = True
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


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
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

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

class DailyPrice(BaseModel):
    date: str
    price: float
    is_available: bool

class PricingResponse(BaseModel):
    room_type: str
    month: int
    year: int
    daily_prices: List[DailyPrice]

class MessageResponse(BaseModel):
    message: str

class SubscriberBase(BaseModel):
    email: str

class SubscriberCreate(SubscriberBase):
    pass

class SubscriberResponse(SubscriberBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class LocalSpotBase(BaseModel):
    name: str
    distance: str
    google_maps_url: Optional[str] = None
    x_pos: int
    y_pos: int

class LocalSpotCreate(LocalSpotBase):
    pass

class LocalSpotResponse(LocalSpotBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
