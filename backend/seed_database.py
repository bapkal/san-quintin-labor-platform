"""
Script to seed the database with initial data using Poisson process.
Run this after setting up your Supabase database.
"""
from data_generator import insert_jobs_to_supabase
from db import supabase
import uuid

def seed_database():
    """Seed the database with initial data."""
    print("🌱 Seeding database with Poisson-generated jobs...")
    
    # Generate and insert jobs using Poisson process
    result = insert_jobs_to_supabase(
        num_jobs=50,
        arrival_rate_minutes=30.0
    )
    
    if result['success']:
        print(f"✅ Successfully inserted {result['jobs_inserted']} jobs")
    else:
        print(f"❌ Error: {result['error']}")
        return
    
    # Optionally create a test grower
    print("\n👨‍🌾 Creating test grower...")
    try:
        # Create test user (grower)
        test_user = {
            'id': str(uuid.uuid4()),
            'role': 'grower',
            'name': 'Test Grower',
            'phone': '+521234567890'
        }
        supabase.table("users").insert(test_user).execute()
        
        # Create grower profile
        test_grower = {
            'user_id': test_user['id'],
            'farm_name': 'Test Farm',
            'location': 'San Quintín, Baja California',
            'contact_person': 'Test Grower'
        }
        supabase.table("growers").insert(test_grower).execute()
        print(f"✅ Created test grower: {test_user['id']}")
    except Exception as e:
        print(f"⚠️  Could not create test grower: {e}")
    
    print("\n✨ Database seeding complete!")

if __name__ == "__main__":
    seed_database()

