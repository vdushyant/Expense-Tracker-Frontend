# Expense Tracker Frontend

React frontend for Expense Tracker backend.

## Live Demo
- Frontend: https://dss70tm98gi6z.cloudfront.net

## AWS Architecture
- Frontend: S3 + CloudFront (HTTPS)
- Backend: EC2 (t3.micro) + CloudFront
- Database: RDS PostgreSQL (Multi-database architecture)
- Security: VPC Security Groups, JWT Authentication

## Tech Stack

- React
- Vite
- Axios
- React Router DOM

## Features

- Register/Login
- JWT authentication
- Protected routes
- Expense CRUD
- Category filter
- CSV export
- Budget status
- Pagination
- Responsive UI

## Run Locally

```bash
npm install
npm run dev