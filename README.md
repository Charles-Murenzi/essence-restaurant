# Essence Smart Dining & Waiter Selection System

A premium, full-stack restaurant management system built for **Essence Bar & Grill** in Rwanda.

## 🚀 Features
- **Premium Digital Menu**: Browse high-quality images and descriptions of Rwandan delicacies.
- **Innovative Waiter Selection**: Customers can choose their preferred server based on ratings, languages, and specialties.
- **Real-time Tracking**: Live updates on order preparation and serving status.
- **Mobile-First Design**: Optimized for tablets (restaurant-provided) and customer smartphones (via QR code).
- **Role-Based Access**: Specialized interfaces for Customers, Waiters, Kitchen Staff, Cashiers, and Admins.

## 🛠️ Technology Stack
- **Frontend**: Next.js 14+, Tailwind CSS, Framer Motion, Shadcn UI.
- **Backend**: ASP.NET Core 8.0 Web API, Entity Framework Core.
- **Database**: PostgreSQL.
- **Real-time**: SignalR.

## 🏁 Getting Started

### Prerequisites
- .NET 8.0 SDK or later
- Node.js 18+ and npm
- PostgreSQL (or SQL Server / SSMS)

### 1. Backend Setup
```bash
cd essence-backend
# Update ConnectionStrings in Essence.Api/appsettings.json
dotnet build
dotnet run --project Essence.Api
```

### 2. Frontend Setup
```bash
cd essence-frontend
npm install
npm run dev
```

## 🏗️ Project Structure
- `/essence-backend`: ASP.NET Core Solution with Clean Architecture.
- `/essence-frontend`: Next.js application with Tailwind CSS and Framer Motion.

## 🌟 Key Innovation: Waiter Selection
Essence empowers customers to personalize their dining experience by selecting their preferred server. This feature:
- Encourages staff to maintain high service standards.
- Provides customers with servers who speak their preferred language.
- Creates a transparent and competitive environment for staff performance.
