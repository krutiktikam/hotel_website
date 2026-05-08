# Project Startup Guide

This project consists of a Next.js frontend and a FastAPI backend. Follow the steps below to get the project up and running.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **Python** (v3.9 or higher recommended)
- **pip** (Python package installer)

---

## 1. Backend Setup (FastAPI)

The backend handles the API, database (SQLite), and file uploads.

1.  **Open a terminal in the project root.**

2.  **Create and activate a virtual environment (optional):**
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r backend/requirements.txt
    ```

4.  **Environment Variables:**
    The backend uses several environment variables for full functionality. Create a `.env` file in the **project root** (or in `backend/` if you prefer, as it's loaded there) with the following:
    ```env
    # Security
    JWT_SECRET_KEY=your_super_secret_key_here

    # Payments (Optional - Stripe)
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_WEBHOOK_SECRET=whsec_...

    # Notifications (Optional - Meta WhatsApp Cloud API)
    WHATSAPP_ACCESS_TOKEN=your_token_here
    WHATSAPP_PHONE_NUMBER_ID=your_phone_id_here

    # URLs
    FRONTEND_URL=http://localhost:3000
    ```
    *Note: The app will automatically seed a default admin user: `username: admin`, `password: password123`.*

4.  **Run the backend server from the root:**
    ```bash
    # Use python -m to avoid "command not found" errors
    python -m uvicorn backend.main:app --reload
    ```

    The backend will be available at [http://localhost:8000](http://localhost:8000). 
    Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 2. Frontend Setup (Next.js)

The frontend is a modern React application using the Next.js App Router.

1.  **Open a new terminal and stay in the root directory.**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## 3. Accessing the Admin Portal

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Credentials:**
    - **Username:** `admin`
    - **Password:** `password123`

---

## Troubleshooting

- **CORS Issues:** Ensure the backend is running on port 8000 and the frontend on port 3000.
- **Database:** The project uses SQLite, which creates a `bookings.db` file in the project root. If you want to reset the database, you can delete this file and restart the backend.
- **Uploads:** Images uploaded via the admin portal are stored in `backend/uploads`.
