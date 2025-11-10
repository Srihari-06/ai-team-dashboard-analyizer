
<h1 align="center">🤖 AI-Powered Team Management Dashboard</h1>

<p align="center">
  A full-stack web application that analyzes Excel task data, generates visual insights, and responds to natural language queries using AI.
</p>

---

<!-- BADGES -->
<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white" alt="Python Badge">
  <img src="https://img.shields.io/badge/Flask-Backend-black?logo=flask&logoColor=white" alt="Flask Badge">
  <img src="https://img.shields.io/badge/MySQL-Database-blue?logo=mysql&logoColor=white" alt="MySQL Badge">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white" alt="React Badge">
  <img src="https://img.shields.io/badge/TailwindCSS-Styling-38BDF8?logo=tailwindcss&logoColor=white" alt="TailwindCSS Badge">
  <img src="https://img.shields.io/badge/OpenAI-Integration-412991?logo=openai&logoColor=white" alt="OpenAI Badge">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License Badge">
</p>

---

## 🧩 Overview

The **AI-Powered Team Management Dashboard** helps teams visualize project performance and gain instant insights from uploaded Excel data.  
It uses **AI to interpret queries**, generate visual analytics, and provide smart performance summaries.

### ✨ Example Queries:
> 🗣️ “How many tasks are still pending?”  
> 💡 “Show me the top-performing team this month.”  
> 📊 “Which projects are blocked?”

---

## ⚙️ Features

✅ Upload Excel files (supports multiple sheets)  
✅ Automatic data parsing and storage in MySQL  
✅ AI-powered task insights and trend summaries  
✅ Natural language query interface  
✅ Interactive charts and dashboards  
✅ Real-time updates after uploads  
✅ Clean and responsive UI  

---

## 🧠 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React, Tailwind CSS, Recharts |
| **Backend** | Flask (Python) |
| **Database** | MySQL |
| **AI Integration** | OpenAI / Gemini 2.5 API |
| **Data Parsing** | Pandas, OpenPyXL |
| **Deployment (optional)** | Docker Compose |

---

## 🧰 Prerequisites

Make sure you have these installed:
- 🐍 **Python 3.8+**
- ⚛️ **Node.js 16+**
- 💾 **MySQL 8.0+**
- 🐳 *(optional)* Docker Desktop

---

## ⚡ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Srihari-06/ai-team-dashboard.git
cd ai-team-dashboard

#### 2️⃣ Database Setup
mysql -u root -p
source database/schema.sql

##### 3️⃣ Backend Setup
cd backend
cp .env.example .env   # Edit DB credentials + OpenAI API key

python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate (Windows)
pip install -r requirements.txt
python app.py

Backend: http://127.0.0.1:5000
###### 4️⃣ Frontend Setup
cd frontend
npm install
npm run dev
Frontend: http://localhost:5173

####### 📊 Folder Structure
ai-team-dashboard/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── uploads/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── database/
│   └── schema.sql

💡 Future Enhancements

User Authentication (Admin / Member)

Advanced AI reports (weekly insights)

Google Sheets integration

Email notifications for task updates

Predictive analytics (AI-based forecasting)

| Upload & Dashboard                                                      | AI Query Interface                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| ![Dashboard] |  |<img width="1920" height="1020" alt="AI Team Management Dashboard - Google Chrome 11_10_2025 7_07_38 PM" src="https://github.com/user-attachments/assets/1c5038f5-561c-4359-a5a5-f1975c731891" /><img width="1920" height="1020" alt="AI Team Management Dashboard - Google Chrome 11_10_2025 7_08_20 PM" src="https://github.com/user-attachments/assets/5361508c-f6a4-4e5f-bcc0-b5d620a2825a" />

🧾 License

This project is licensed under the MIT License.

MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

🧠 Keywords
#AI #Flask #React #MySQL #WebDevelopment #OpenAI #Gemini #FullStack #Dashboard #DataAnalytics #TeamManagement

💬 Connect With Me
👋 Created by Srihari Bheemavaram
⭐ Star this repo if you like the project!




