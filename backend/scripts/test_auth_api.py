import sys
import os
import json
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

    def test_auth_flow():
        setup_db()
        
        # 1. Test Registration
        print("Testing Registration...")
        reg_data = {
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        }
        response = client.post("/auth/register", json=reg_data)
        print(f"Registration response: {response.status_code}")
        if response.status_code != 201:
            print(f"Error detail: {response.text}")
        assert response.status_code == 201
        assert response.json()["message"] == "User registered successfully"
        print("✅ Registration successful")

        # 2. Test Registration Validation (short password)
        print("Testing Registration Validation (short password)...")
        bad_reg_data = {
            "username": "short",
            "email": "short@example.com",
            "full_name": "Short Pass",
            "password": "123"
        }
        response = client.post("/auth/register", json=bad_reg_data)
        assert response.status_code == 422
        print("✅ Registration validation (password) successful")

        # 3. Test Login
        print("Testing Login...")
        login_data = {
            "username": "testuser",
            "password": "password123"
        }
        response = client.post("/auth/login", json=login_data)
        if response.status_code != 200:
             print(f"Error detail: {response.text}")
        assert response.status_code == 200
        token_data = response.json()
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"
        print("✅ Login successful")

        # 4. Verify last_login_at
        print("Verifying last_login_at update...")
        db = TestingSessionLocal()
        user = db.query(User).filter(User.username == "testuser").first()
        assert user.last_login_at is not None
        print(f"✅ last_login_at updated: {user.last_login_at}")
        db.close()

if __name__ == "__main__":
    try:
        test_auth_flow()
        print("\n🎉 All auth tests passed!")
    except Exception as e:
        print(f"\n❌ Tests failed: {e}")
        sys.exit(1)
