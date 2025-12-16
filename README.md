# WeatherCrypto API Integration

## Project Overview
WeatherCrypto API Dashboard is a modern, API-driven web application that provides **real-time weather information** and **live cryptocurrency market data** through a clean and responsive user interface.  
The application demonstrates how **REST APIs** can be securely consumed, processed, and displayed in a full-stack environment.

## Objectives
- To understand and implement **API integration** in a real-world application
- To fetch and display **live weather data** using external APIs
- To fetch and display **real-time cryptocurrency prices and 24-hour changes**
- To build a **modern, responsive UI dashboard**
- To demonstrate **secure API handling** through a backend layer

## How APIs Are Used in This Project
- The frontend sends HTTP requests to a backend REST API
- The backend communicates with third-party services:
  - **OpenWeather API** for weather data
  - **CoinGecko API** for cryptocurrency prices
- The backend processes and returns structured JSON data
- The frontend displays this data in a user-friendly dashboard

This separation ensures security, scalability, and clean architecture.

## Features
- Real-time weather lookup by city
- Live cryptocurrency price lookup
- 24-hour price change indicators
- User authentication (JWT-based)
- Modern glass-style UI
- Responsive design
- Fast API response handling
- Clean error handling

## Technology Stack

### Frontend
- **Next.js (React)**
- JavaScript
- Modern CSS (inline styling)
- Responsive UI components

### Backend
- **Django**
- **Django REST Framework**
- JWT Authentication

### APIs Used
- **OpenWeather API** – Weather data
- **CoinGecko API** – Cryptocurrency data
  
## Authentication Flow
- Users register and log in using credentials
- Backend issues a **JWT access token**
- Token is stored securely in the browser
- Authenticated requests include the token in headers
- Protected APIs validate the token before responding

## Weather Module
- User enters a city name
- Backend fetches weather data from OpenWeather API
- Data displayed:
  - Weather condition
  - Temperature
  - Feels-like temperature
  - Humidity
  - Wind speed

## Crypto Module
- User enters cryptocurrency IDs (e.g., bitcoin, ethereum)
- Backend fetches data from CoinGecko API
- Data displayed:
  - Current price
  - 24-hour percentage change
  - Currency comparison

## Installation & Setup

### Backend
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver

### Frontend
npm install
npm run dev




