# AI-Powered Team Management Dashboard

A full-stack application that analyzes Excel task data, generates visual insights, and responds to natural language queries using AI.

## Features

- Upload Excel files with multiple sheets
- Automatic data parsing and storage in MySQL
- AI-powered insights and trend analysis
- Natural language query interface
- Interactive charts and visualizations
- Real-time dashboard updates

## Tech Stack

- **Frontend**: React + Tailwind CSS + Recharts
- **Backend**: Flask (Python)
- **Database**: MySQL
- **AI Integration**: OpenAI / Gemini 2.5 API

## Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup

```bash
# Login to MySQL and create database
mysql -u root -p
source database/schema.sql