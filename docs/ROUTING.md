# Azure Sands - URL Routing Map

| URL Path | Description | Component/Page |
| :--- | :--- | :--- |
| `/` | Landing page with quick booking form | `app/page.tsx` |
| `/rooms` | Room category listing (Sanctuaries) | `app/rooms/page.tsx` |
| `/rooms/[slug]` | Detailed room page with gallery | `app/rooms/[slug]/page.tsx` |
| `/experiences` | Lifestyle activities and upsells | `app/experiences/page.tsx` |
| `/about` | Brand story and minimalism philosophy | *Pending* |
| `/gallery` | Visual showcase of the resort | *Pending* |
| `/contact` | Contact info and map | *Pending* |

### API Endpoints
- **Python (FastAPI):** `http://localhost:8000/api/v1/booking/confirm`
- **Next.js (Legacy/Backup):** `/api/book`
