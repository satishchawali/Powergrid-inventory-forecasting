import sys
import os
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Ensure app is in python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Create mock settings before importing app
mock_settings = MagicMock()
mock_settings.ACCESS_TOKEN_EXPIRE_MINUTES = 30
mock_settings.SECRET_KEY = "test_secret_key"
mock_settings.ALGORITHM = "HS256"
mock_settings.DATABASE_URL = "sqlite://"

with patch('app.config.settings', mock_settings):
    from app.main import app
    from app.database import Base
    from app.models.user import User
    from app.routes.auth import get_db

    # Use an in-memory SQLite database for testing
    SQLALCHEMY_DATABASE_URL = "sqlite://"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    client = TestClient(app)

    def setup_db():
        Base.metadata.create_all(bind=engine)

    def test_profile_update_flow():
        setup_db()
        
        # 1. Register
        print("Testing Registration...")
        reg_data = {
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        }
        res_reg = client.post("/auth/register", json=reg_data)
        assert res_reg.status_code == 201
        print("✅ Registration successful")

        # 2. Login
        print("Testing Login...")
        login_data = {"username": "testuser", "password": "password123"}
        res_login = client.post("/auth/login", json=login_data)
        assert res_login.status_code == 200
        token = res_login.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Login successful")

        # 3. Get Profile
        print("Testing Get Profile...")
        res_profile = client.get("/auth/profile", headers=headers)
        if res_profile.status_code != 200:
             print(f"FAILED GET PROFILE: {res_profile.text}")
        assert res_profile.status_code == 200
        assert res_profile.json()["email"] == "test@example.com"
        print("✅ Get Profile successful")

        # 4. Update Profile
        print("Testing Update Profile...")
        update_data = {
            "full_name": "Updated Name",
            "email": "updated@example.com"
        }
        res_update = client.put("/auth/profile", json=update_data, headers=headers)
        if res_update.status_code != 200:
            print(f"FAILED UPDATE PROFILE: {res_update.text}")
        assert res_update.status_code == 200
        assert res_update.json()["full_name"] == "Updated Name"
        assert res_update.json()["email"] == "updated@example.com"
        print("✅ Update Profile successful")

        # 5. Verify Persistence
        print("Verifying Persistence...")
        res_profile_2 = client.get("/auth/profile", headers=headers)
        assert res_profile_2.json()["full_name"] == "Updated Name"
        print("✅ Persistence verified")

if __name__ == "__main__":
    try:
        test_profile_update_flow()
        print("\n🎉 All profile tests passed!")
    except Exception as e:
        print(f"\n❌ Tests failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
