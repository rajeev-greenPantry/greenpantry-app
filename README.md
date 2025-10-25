# 🍽️ GreenPantry - Food Delivery Application

A modern food delivery application built with .NET 8 Web API and React 18 with TypeScript.

## 🚀 Features

### Backend (.NET 8 Web API)
- **Authentication & Authorization** - JWT-based auth with refresh tokens
- **User Management** - Registration, login, profile management
- **Restaurant Management** - Restaurant listings, details, and management
- **Menu Management** - Menu items, categories, and variants
- **Order Management** - Order creation, tracking, and status updates
- **Geolocation Services** - Address lookup and reverse geocoding
- **Cosmos DB Integration** - Scalable NoSQL database
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation
- **Serilog** - Structured logging

### Frontend (React 18 + TypeScript)
- **Modern UI** - Built with Tailwind CSS
- **State Management** - Zustand for global state
- **Data Fetching** - TanStack Query for server state
- **Form Handling** - React Hook Form with Zod validation
- **Routing** - React Router v6
- **Responsive Design** - Mobile-first approach
- **Geolocation Integration** - Get current address functionality

## 🏗️ Architecture

```
GreenPantry/
├── backend/                 # .NET 8 Web API
│   ├── GreenPantry.API/    # Web API layer
│   ├── GreenPantry.Application/  # Business logic
│   ├── GreenPantry.Domain/      # Domain entities
│   └── GreenPantry.Infrastructure/  # Data access
├── frontend/               # React 18 + TypeScript
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── types/         # TypeScript types
├── cosmos-db/             # Database setup and sample data
└── docker-compose.yml     # Container orchestration
```

## 🛠️ Tech Stack

### Backend
- **.NET 8** - Web API framework
- **Azure Cosmos DB** - NoSQL database
- **JWT** - Authentication
- **AutoMapper** - Object mapping
- **FluentValidation** - Validation
- **Serilog** - Logging

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **TanStack Query** - Data fetching
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## 🚀 Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- Azure Cosmos DB account
- Git

### Backend Setup
```bash
cd backend
dotnet restore
dotnet build
dotnet run --urls "http://localhost:7001"
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Using Docker
```bash
docker-compose up --build
```

## 📝 Environment Variables

### Backend (.env)
```json
{
  "CosmosDb": {
    "ConnectionString": "YOUR_COSMOS_DB_CONNECTION_STRING",
    "DatabaseName": "greenpantry"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY",
    "Issuer": "GreenPantry",
    "Audience": "GreenPantryUsers",
    "ExpiryMinutes": 60
  }
}
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:7001/api
```

## 🗄️ Database Schema

### Collections
- **Users** - User accounts and profiles
- **Vendors** - Restaurant information
- **Products** - Menu items
- **Orders** - Order details and tracking

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/address` - Update address

### Restaurants
- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/{id}` - Get restaurant details
- `GET /api/restaurants/{id}/menu` - Get restaurant menu

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details
- `GET /api/orders/user/{userId}` - Get user orders

### Geolocation
- `GET /api/geolocation/current` - Get current location
- `POST /api/geolocation/coordinates` - Get address from coordinates

## 🧪 Testing

### Backend
```bash
cd backend
dotnet test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Deployment

### Docker
```bash
docker-compose up --build
```

### Manual Deployment
1. Build backend: `dotnet publish -c Release`
2. Build frontend: `npm run build`
3. Deploy to your preferred hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- OpenStreetMap for geolocation services
- Azure Cosmos DB for database services
- All the amazing open-source libraries used in this project

## 📞 Support

If you have any questions or need help, please open an issue or contact us at [your-email@example.com](mailto:your-email@example.com).

---

**Happy Coding! 🚀**