from fastapi import FastAPI, HTTPException, Depends, Body, Request, BackgroundTasks, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import json
import os
import shutil
import uuid
from jose import JWTError, jwt
from dotenv import load_dotenv

from . import models, schemas, services, database, notifications, payments, auth
from .database import engine, get_db

# Load environment variables
load_dotenv()

# Create uploads directory relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Create database tables
models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = next(database.get_db())
    # Seed Rooms
    if db.query(models.Room).count() == 0:
        rooms = [
            models.Room(name="Luxury", slug="ocean-suite", description="Panoramic views of the Atlantic with a private terrace.", price=450, size="65m²", guests="2 Adults", features=json.dumps(['Sea View', 'Private Balcony', 'King Bed']), image_url="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"),
            models.Room(name="Suite", slug="garden-villa", description="Secluded villa surrounded by native flora and salt air.", price=380, size="80m²", guests="2-4 Adults", features=json.dumps(['Garden View', 'Outdoor Shower', 'Queen Bed']), image_url="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"),
            models.Room(name="Deluxe", slug="dune-studio", description="Minimalist studio perfect for solo retreats or couples.", price=290, size="45m²", guests="2 Adults", features=json.dumps(['Dune View', 'Work Space', 'Queen Bed']), image_url="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800"),
        ]
        db.add_all(rooms)
    
    # Seed Experiences
    if db.query(models.Experience).count() == 0:
        experiences = [
            models.Experience(title='Sunrise Shore Yoga', category='Wellness', description='Begin your day in harmony with the tides.', price=45, duration='90 Minutes', image_url='https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000', icon_name='Sunrise'),
            models.Experience(title='Minimalist Beach Picnic', category='Dining', description='A curated basket of local, organic delicacies.', price=120, duration='Flexible', image_url='https://images.unsplash.com/photo-1590377033320-911075d97039?auto=format&fit=crop&q=80&w=1000', icon_name='Palmtree'),
        ]
        db.add_all(experiences)
        
    # Seed Gallery
    if db.query(models.GalleryImage).count() == 0:
        gallery = [
            models.GalleryImage(url='https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=800', category='Architecture', span_class='md:col-span-2 md:row-span-2'),
            models.GalleryImage(url='https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800', category='Interiors'),
        ]
        db.add_all(gallery)
    
    # Seed Admin User
    if db.query(models.User).count() == 0:
        admin_user = models.User(
            username="admin",
            hashed_password=auth.get_password_hash("password123")
        )
        db.add(admin_user)
    
    db.commit()

seed_database()

app = FastAPI(title="Hotel Booking API")

# Serve static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

# --- PUBLIC ENDPOINTS ---

@app.get("/api/v1/options", response_model=schemas.OptionsResponse)
def get_options():
    return services.get_options()

@app.get("/api/v1/rooms", response_model=List[schemas.RoomResponse])
def get_rooms(db: Session = Depends(get_db)):
    rooms = db.query(models.Room).filter(models.Room.is_active == True).all()
    # Handle JSON features parsing
    for room in rooms:
        room.features = json.loads(room.features) if room.features else []
    return rooms

@app.get("/api/v1/gallery", response_model=List[schemas.GalleryImageResponse])
def get_gallery(db: Session = Depends(get_db)):
    return db.query(models.GalleryImage).all()

@app.get("/api/v1/experiences", response_model=List[schemas.ExperienceResponse])
def get_experiences(db: Session = Depends(get_db)):
    return db.query(models.Experience).all()

@app.get("/api/v1/availability", response_model=schemas.AvailabilityResponse)
def check_room_availability(room_type: str, check_in: str, check_out: str, db: Session = Depends(get_db)):
    is_available = services.check_availability(db, room_type, check_in, check_out)
    return {"is_available": is_available}

@app.post("/api/v1/bookings", response_model=schemas.BookingResponse)
async def create_booking(booking: schemas.BookingCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if not services.check_availability(db, booking.room_type, booking.check_in, booking.check_out):
        raise HTTPException(status_code=409, detail="Room not available for selected dates")
    total_price = services.calculate_total_price(db, booking)
    db_booking = models.Booking(
        customer_name=booking.customer_name,
        customer_phone=booking.customer_phone,
        room_type=booking.room_type,
        check_in=booking.check_in,
        check_out=booking.check_out,
        meal_plan=booking.meal_plan,
        package_type=booking.package_type,
        special_requests=booking.special_requests,
        addons=json.dumps(booking.selected_addons),
        total_price=total_price,
        status="confirmed"  # Auto-confirm since we're skipping payments
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    # Send WhatsApp confirmation
    background_tasks.add_task(notifications.send_whatsapp_confirmation, db_booking)
    
    response_data = schemas.BookingResponse.from_orm(db_booking)
    response_data.selected_addons = json.loads(db_booking.addons)
    return response_data

# --- AUTH ENDPOINTS ---

@app.post("/api/v1/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/v1/auth/register", response_model=schemas.UserResponse)
def register_admin(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # In a real app, you might restrict who can register or use a secret key
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = models.User(
        username=user.username,
        hashed_password=auth.get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- ADMIN ENDPOINTS (PROTECTED) ---

@app.post("/api/v1/admin/rooms", response_model=schemas.RoomResponse)
def create_room(room: schemas.RoomCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_room = models.Room(
        name=room.name,
        slug=room.slug,
        description=room.description,
        price=room.price,
        size=room.size,
        guests=room.guests,
        features=json.dumps(room.features),
        image_url=room.image_url,
        is_active=room.is_active
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    db_room.features = json.loads(db_room.features)
    return db_room

@app.put("/api/v1/admin/rooms/{room_id}", response_model=schemas.RoomResponse)
def update_room(room_id: int, room: schemas.RoomCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    for key, value in room.dict().items():
        if key == "features":
            setattr(db_room, key, json.dumps(value))
        else:
            setattr(db_room, key, value)
    db.commit()
    db.refresh(db_room)
    db_room.features = json.loads(db_room.features)
    return db_room

@app.delete("/api/v1/admin/rooms/{room_id}")
def delete_room(room_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    db.delete(db_room)
    db.commit()
    return {"message": "Room deleted successfully"}

@app.post("/api/v1/admin/experiences", response_model=schemas.ExperienceResponse)
def create_experience(exp: schemas.ExperienceCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_exp = models.Experience(**exp.dict())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@app.post("/api/v1/admin/gallery", response_model=schemas.GalleryImageResponse)
def create_gallery_image(img: schemas.GalleryImageCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_img = models.GalleryImage(**img.dict())
    db.add(db_img)
    db.commit()
    db.refresh(db_img)
    return db_img

@app.get("/api/v1/admin/bookings", response_model=List[schemas.BookingResponse])
def get_all_bookings(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).all()
    # Need to handle addons parsing for each booking in the list
    results = []
    for b in bookings:
        res = schemas.BookingResponse.from_orm(b)
        res.selected_addons = json.loads(b.addons) if b.addons else []
        results.append(res)
    return results

@app.patch("/api/v1/admin/bookings/{booking_id}", response_model=schemas.BookingResponse)
def update_booking_status(booking_id: int, status: str = Body(..., embed=True), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = status
    db.commit()
    db.refresh(booking)
    res = schemas.BookingResponse.from_orm(booking)
    res.selected_addons = json.loads(booking.addons) if booking.addons else []
    return res

@app.delete("/api/v1/admin/bookings/{booking_id}")
def delete_booking(booking_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted successfully"}

# --- UPLOAD ENDPOINT ---

@app.post("/api/v1/admin/upload")
async def upload_file(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user)):
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/uploads/{unique_filename}"}

# --- STRIPE ENDPOINTS ---

@app.post("/api/v1/checkout/session")
def create_stripe_checkout(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    session = payments.create_checkout_session(booking)
    if not session:
        raise HTTPException(status_code=500, detail="Failed to create checkout session")
    return {"checkout_url": session.url}

@app.post("/api/v1/webhooks/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    booking_id, error = payments.handle_stripe_webhook(payload, sig_header)
    if error:
        raise HTTPException(status_code=400, detail=error)
    if booking_id:
        booking = db.query(models.Booking).filter(models.Booking.id == int(booking_id)).first()
        if booking:
            booking.status = "confirmed"
            db.commit()
            print(f"Booking {booking_id} confirmed via Stripe.")
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
