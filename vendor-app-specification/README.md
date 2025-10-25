# GreenPantry Vendor App - Complete Specification for Cursor AI

This specification package provides everything needed to generate a complete Vendor App website and .NET Core API backend for the GreenPantry food delivery platform.

## 📋 What's Included

1. **Database Schema** - Complete Entity Framework models
2. **API Controllers** - RESTful endpoints with full CRUD operations
3. **Authentication System** - JWT-based vendor authentication
4. **Frontend Pages** - Complete React/TypeScript web app
5. **Sample Data** - Ready-to-use test data
6. **Configuration Files** - All necessary setup files

## 🎯 Project Overview

**GreenPantry Vendor App** is a comprehensive platform where restaurants can:
- Manage their restaurant profiles and information
- Create and manage cuisine categories
- Add, edit, and manage menu products
- Process and track customer orders
- View analytics and sales data
- Manage vendor accounts and permissions

## 🏗️ Architecture

- **Backend**: .NET Core 8 Web API with Entity Framework Core
- **Frontend**: React 18 with TypeScript and Tailwind CSS
- **Database**: SQL Server with Code-First migrations
- **Authentication**: JWT tokens with role-based authorization
- **File Upload**: Azure Blob Storage integration
- **Real-time**: SignalR for live order updates

## 🚀 Quick Start

1. **Generate Backend API**:
   ```
   Use the database-schema.json and api-controllers.json files
   ```

2. **Generate Frontend App**:
   ```
   Use the frontend-pages.json and component-specs.json files
   ```

3. **Setup Database**:
   ```
   Use the sample-data.json for initial data
   ```

4. **Configure Authentication**:
   ```
   Use the auth-config.json for JWT setup
   ```

## 📁 File Structure

```
vendor-app-specification/
├── README.md
├── database-schema.json
├── api-controllers.json
├── frontend-pages.json
├── component-specs.json
├── sample-data.json
├── auth-config.json
├── docker-compose.yml
├── package.json
└── project-structure.md
```

## 🔧 Technology Stack

### Backend
- .NET Core 8
- Entity Framework Core
- SQL Server
- JWT Authentication
- AutoMapper
- Swagger/OpenAPI
- SignalR
- Azure Blob Storage

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Query
- React Hook Form
- Chart.js
- React Hot Toast

## 📊 Features

### Restaurant Management
- ✅ Create/Edit restaurant profiles
- ✅ Upload restaurant logos and images
- ✅ Manage contact information
- ✅ Set working hours and delivery areas

### Cuisine Management
- ✅ Create cuisine categories
- ✅ Link cuisines to restaurants
- ✅ Manage cuisine descriptions and images

### Product Management
- ✅ Add/Edit menu items
- ✅ Upload product images
- ✅ Set prices and availability
- ✅ Manage product categories
- ✅ Track inventory levels

### Order Management
- ✅ View incoming orders
- ✅ Update order status
- ✅ Track order history
- ✅ Real-time order notifications

### Analytics Dashboard
- ✅ Sales overview
- ✅ Popular products
- ✅ Order statistics
- ✅ Revenue charts

### User Management
- ✅ Vendor registration/login
- ✅ Role-based permissions
- ✅ Profile management
- ✅ Password reset

## 🔐 Security Features

- JWT-based authentication
- Role-based authorization (Admin, Manager, Staff)
- Password hashing with BCrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- File upload security

## 📱 Responsive Design

- Mobile-first approach
- Desktop and tablet optimized
- Touch-friendly interface
- Progressive Web App (PWA) ready
- Dark/Light theme support

## 🚀 Deployment

- Docker containerization
- Azure App Service ready
- SQL Server Azure integration
- Environment-based configuration
- CI/CD pipeline ready

## 📞 Support

For questions or issues with the generated code:
- Check the component-specs.json for detailed requirements
- Review the sample-data.json for expected data format
- Use the auth-config.json for authentication setup

---

**Ready to generate your complete Vendor App!** 🎉
