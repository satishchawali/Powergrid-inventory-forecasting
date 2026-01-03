project-root/
├── app/
│   ├── core/
│   │   ├── config.py         # Configuration settings (e.g., environment variables)
│   │   ├── security.py       # Authentication logic, password hashing, token management
│   │   └── __init__.py
│   ├── db/
│   │   ├── database.py       # Database connection, session management (SQLAlchemy engine, etc.)
│   │   └── __init__.py
│   ├── models/
│   │   ├── user.py           # SQLAlchemy/SQLModel models for database tables
│   │   ├── item.py
│   │   └── __init__.py
│   ├── schemas/
│   │   ├── user.py           # Pydantic models for data validation, requests, and responses
│   │   ├── item.py
│   │   └── __init__.py
│   ├── services/
│   │   ├── user_service.py   # Business logic and interactions with the database layer
│   │   ├── item_service.py
│   │   └── __init__.py
│   ├── routers/
│   │   ├── users.py          # API endpoints (path operations) using `APIRouter`
│   │   ├── items.py
│   │   └── __init__.py
│   └── main.py             # The main application entry point (includes routers, middleware)
├── tests/
│   ├── conftest.py
│   ├── test_users.py         # Unit and integration tests
│   └── test_items.py
├── requirements.txt        # Project dependencies (fastapi, uvicorn, sqlalchemy, pydantic, pytest, etc.)
└── .env                    # Environment variables file