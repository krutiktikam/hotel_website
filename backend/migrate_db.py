import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL not found in environment variables.")
    exit(1)

# Fix for Render/Railway Postgres URLs (replace postgres:// with postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def migrate():
    print("Starting database migration...")
    
    queries = [
        # Add 'category' column to rooms table if it doesn't exist
        "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS category VARCHAR;",
        
        # Add 'unit_name' column to rooms table if it doesn't exist
        "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS unit_name VARCHAR;",
        
        # Add 'seo_title' column if missing
        "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS seo_title VARCHAR;",
        
        # Add 'seo_description' column if missing
        "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS seo_description VARCHAR;",
        
        # Update existing records to have a default unit_name and category if null
        "UPDATE rooms SET category = 'DELUXE' WHERE category IS NULL;",
        "UPDATE rooms SET unit_name = name || ' - Unit' WHERE unit_name IS NULL;",
        
        # Add unique constraint to unit_name if possible (might fail if duplicates exist, hence the update above)
        # "ALTER TABLE rooms ADD CONSTRAINT unique_unit_name UNIQUE (unit_name);"
    ]

    with engine.connect() as conn:
        for query in queries:
            try:
                print(f"Executing: {query}")
                conn.execute(text(query))
                conn.commit()
            except Exception as e:
                print(f"Error executing query: {e}")
    
    print("Migration completed.")

if __name__ == "__main__":
    migrate()
