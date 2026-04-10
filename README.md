# ⚡ Powergrid Inventory Forecasting

![Powergrid Inventory Forecasting](https://img.shields.io/badge/Status-Active-success) ![Machine Learning](https://img.shields.io/badge/ML-Predictive%20Modeling-blue) ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688) ![React](https://img.shields.io/badge/Frontend-React-61dafb)

## 📌 Overview

**Powergrid Inventory Forecasting** is a comprehensive, full-stack application designed to predict and manage material demand for power grid infrastructure projects. By integrating Machine Learning pipelines with a robust backend and an intuitive frontend dashboard, this platform enables project managers to forecast required inventory based on project budgets, regions, tower types, and historical data.

This project reduces inventory stockouts, optimizes safety stock levels, and ensures power grid construction projects have the materials they need precisely when they need them.

---

## ✨ Features

### 🔐 Authentication & User Management
- Secure user registration and login with JWT-based authentication.
- Password hashing and secure token management.
- Protected routes to ensure data privacy.

### 📊 Dashboard & Reporting
- High-level overview of inventory status, stock levels, and critical materials.
- Comprehensive reporting module to view and download inventory forecasts.
- Real-time visual metrics for operational insights.

### 🤖 Intelligent Forecasting (Machine Learning)
- Predicts required material quantities utilizing **Random Forest Regressor** and **Gradient Boosting / XGBoost** models.
- Features take into account project budget, weather index, lead times, region, and tower types.
- Auto-evaluates and selects the most accurate model based on \( R^2 \) and RMSE scores.

### 📦 Inventory Management
- Track material stocks, lead times, and required quantities.
- Categorization of materials (e.g., sufficient stock, critical stock) to prioritize procurement.

---

## 🏗️ Architecture & Tech Stack

The system is divided into three main components:

### 1. Frontend (`/frontend`)
- **Framework:** React.js (Bootstrapped with Create React App)
- **Routing:** React Router DOM V7
- **Styling & UI:** Custom CSS, Lucide React (Icons), React Hot Toast (Notifications)
- **API Communication:** Axios

### 2. Backend (`/backend`)
- **Framework:** FastAPI (Python)
- **Database:** SQLite/PostgreSQL (Configured via SQLAlchemy + SQLModel/Pydantic)
- **Authentication:** OAuth2 with Password Bearer, JWT Tokens (Passlib, python-jose)
- **Data processing:** Pandas, Numpy, Scikit-learn (for serving the model insights)

### 3. Machine Learning (`/ml`)
- **Tools:** Pandas, NumPy, Scikit-learn, XGBoost, LightGBM, Joblib
- **Pipeline:**
  - Data preprocessing & cleaning
  - Feature engineering (cyclic encoding, interaction features)
  - Multi-model training
  - Hyperparameter tuning (GridSearchCV)
  - Model evaluation & comparison
  - Best model selection and persistence
- **Models Used:**
  - XGBoost (Best Performing Model)
  - Random Forest Regressor
  - LightGBM Regressor

---

## ⚙️ Setup & Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Powergrid-inventory-forecasting.git
cd Powergrid-inventory-forecasting
```

### 2. Backend Setup
The FastAPI server manages the API endpoints and database interactions.

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup Environment Variables
copy .env.example .env
# Edit the `.env` file with your specific database/JWT secret keys.

# Run the backend server
uvicorn app.main:app --reload
```
The backend API will be available at `http://localhost:8000`. You can explore the interactive API documentation at `http://localhost:8000/docs`.

### 3. Machine Learning Pipeline Setup
The ML module trains the model required by the backend to make forecast predictions.

```bash
cd ml

# (Assuming you are in a virtual environment)
# Install ML specific dependencies
pip install -r requirements.txt

# Run the complete pipeline (Generates data -> Trains -> Evaluates -> Saves Model)
python run_pipeline.py
```
*Note: Make sure the trained model `.pkl` or `.joblib` files are correctly mapped to the backend for the prediction endpoints to function.*

### 4. Frontend Setup
The React application provides the user interface.

```bash
cd frontend

# Install Node dependencies
npm install

# Run the React development server
npm start
```
The frontend will be accessible at `http://localhost:3000`.

---

## 📖 Usage Guide

1. **Sign Up / Login:** Open the web app at `http://localhost:3000`. Create a new account or log in if you already have credentials. *(Note: Password confirmation is active to ensure error-free registration).*
2. **Dashboard:** Upon logging in, view the high-level metrics of current inventory.
3. **Materials:** Navigate to the Materials page to view current stocks. Use pagination and search features to find specific components.
4. **Forecast:** Go to the Forecast section, input your powergrid project parameters (budget, region, etc.), and receive an AI-driven estimate of material requirements.
5. **Reports:** Generate, view, and comprehensively download reports summarizing inventory needs and ML predictions.

---

## 🚀 Future Enhancements
- Dockerizing the entire operational stack utilizing `docker-compose`.
- Transitioning to an LSTM time-series model for temporal forecasting.
- Setting up automated CI/CD pipelines via GitHub Actions.
- Enhancing real-time weather API integration for more robust forecasting models.

---

## 📝 License
This project is developed as a Final Year academic project. All rights reserved.