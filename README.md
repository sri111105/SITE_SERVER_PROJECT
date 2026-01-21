# ISP Site Survey Tool

## Project Overview
This is a full-stack application for ISP Site Surveys.
- **Backend**: Spring Boot (Java 17), MySQL, JWT Authentication.
- **Frontend**: React, Vite, Tailwind CSS.

## Prerequisites
1.  **Java JDK 17+** installed.
2.  **Node.js & npm** installed.
3.  **MySQL Database** running.
    -   Create a database named `sitesurvey`.
    -   Update `backend/src/main/resources/application.properties` with your username/password if different from `root/root@123`.

## Setup & Running

### 1. Database Setup
The included script `run_backend.ps1` attempts to create the database if you have MySQL at the default location.
Otherwise, manually create it:
```sql
CREATE DATABASE sitesurvey;
```

### 2. Backend (Automated)
We have provided a PowerShell script to automatically setup Maven and run the backend.
Navigate to the `backend` folder and run:
```powershell
./run_backend.ps1
```
This script will:
- Check for MySQL.
- Download portable Maven (if needed).
- Run the Spring Boot application.

The server will start on `http://localhost:8080`.

### 3. Frontend
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
```
Install dependencies (if not already done):
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in terminal).

## Default Roles
-   **User**: Can view assigned surveys and execute them.
-   **Moderator/Admin**: Can create properties, buildings, floors, and manage templates.

## API Documentation
Base URL: `http://localhost:8080/api`
