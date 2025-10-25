# GreenPantry Data Management Guide

This guide provides comprehensive instructions for managing restaurant, cuisine, and product data in the GreenPantry food delivery platform.

## 🎯 Overview

The GreenPantry Data Management System provides:
- **Restaurant Management**: Create, update, and manage restaurant information
- **Cuisine Management**: Assign and update cuisine types for restaurants
- **Product Management**: Manage menu items, prices, availability, and variants
- **Data Synchronization**: Keep all modules (Customer, Vendor, Admin) in sync
- **Bulk Operations**: Efficiently handle large-scale data updates

## 🚀 Quick Start

### 1. Seed Initial Data
```bash
# Seed all sample data
curl -X POST "https://localhost:7001/api/DataManagement/seed/all" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Or seed specific data types
curl -X POST "https://localhost:7001/api/DataManagement/seed/restaurants"
curl -X POST "https://localhost:7001/api/DataManagement/seed/menu-items"
```

### 2. Using PowerShell Script
```powershell
# Seed all data
.\ManageData.ps1 -Action "seed-all" -ApiBaseUrl "https://localhost:7001" -AuthToken "YOUR_TOKEN"

# Bulk update from JSON file
.\ManageData.ps1 -Action "bulk-update" -DataFile "sample-restaurants.json" -AuthToken "YOUR_TOKEN"
```

## 📊 Data Structure

### Restaurant Data Model
```json
{
  "id": "restaurant-1",
  "name": "Restaurant Name",
  "description": "Restaurant description",
  "imageUrl": "https://example.com/image.jpg",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "123 Street Name",
  "postalCode": "400001",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "phoneNumber": "+91-22-1234-5678",
  "email": "info@restaurant.com",
  "cuisineTypes": ["Indian", "Chinese"],
  "rating": 4.5,
  "reviewCount": 1250,
  "deliveryFee": 50,
  "estimatedDeliveryTime": 30,
  "isActive": true,
  "ownerId": "vendor-1",
  "imageUrls": ["https://example.com/image1.jpg"],
  "status": "Approved"
}
```

### Menu Item Data Model
```json
{
  "id": "menu-1",
  "restaurantId": "restaurant-1",
  "name": "Dish Name",
  "description": "Dish description",
  "price": 250.00,
  "imageUrl": "https://example.com/dish.jpg",
  "category": "Main Course",
  "isVegetarian": true,
  "isVegan": false,
  "isGlutenFree": true,
  "isSpicy": true,
  "spiceLevel": 3,
  "allergens": ["Dairy", "Nuts"],
  "ingredients": ["Rice", "Vegetables", "Spices"],
  "preparationTime": 20,
  "isAvailable": true,
  "stockQuantity": -1,
  "variants": [
    {
      "name": "Regular",
      "priceModifier": 0,
      "isDefault": true
    },
    {
      "name": "Large",
      "priceModifier": 50,
      "isDefault": false
    }
  ],
  "tags": ["Popular", "Spicy", "Traditional"]
}
```

## 🔧 API Operations

### Restaurant Management

#### Create/Update Restaurant
```http
POST /api/DataManagement/restaurants
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "id": "restaurant-new",
  "name": "New Restaurant",
  "description": "A new restaurant",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "123 New Street",
  "postalCode": "400001",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "phoneNumber": "+91-22-1234-5678",
  "email": "info@newrestaurant.com",
  "cuisineTypes": ["Indian"],
  "rating": 0.0,
  "reviewCount": 0,
  "deliveryFee": 50,
  "estimatedDeliveryTime": 30,
  "isActive": true,
  "ownerId": "vendor-1",
  "imageUrls": ["https://example.com/image.jpg"],
  "status": "Pending"
}
```

#### Update Restaurant Cuisines
```http
PUT /api/DataManagement/restaurants/{restaurantId}/cuisines
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

["Indian", "Chinese", "Thai"]
```

#### Update Restaurant Status
```http
PUT /api/DataManagement/restaurants/{restaurantId}/status
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

"Approved"
```

### Menu Item Management

#### Create/Update Menu Item
```http
POST /api/DataManagement/menu-items
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "id": "menu-new",
  "restaurantId": "restaurant-1",
  "name": "New Dish",
  "description": "A delicious new dish",
  "price": 250.00,
  "imageUrl": "https://example.com/dish.jpg",
  "category": "Main Course",
  "isVegetarian": true,
  "isVegan": false,
  "isGlutenFree": true,
  "isSpicy": false,
  "spiceLevel": 1,
  "allergens": [],
  "ingredients": ["Rice", "Vegetables", "Spices"],
  "preparationTime": 20,
  "isAvailable": true,
  "stockQuantity": -1,
  "variants": [
    {
      "name": "Regular",
      "priceModifier": 0,
      "isDefault": true
    }
  ],
  "tags": ["New", "Vegetarian"]
}
```

#### Update Menu Item Availability
```http
PUT /api/DataManagement/menu-items/{menuItemId}/availability
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

true
```

#### Update Menu Item Price
```http
PUT /api/DataManagement/menu-items/{menuItemId}/price
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

275.00
```

#### Update Menu Item Stock
```http
PUT /api/DataManagement/menu-items/{menuItemId}/stock
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

50
```

### Bulk Operations

#### Bulk Update Restaurants
```http
POST /api/DataManagement/restaurants/bulk
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

[
  {
    "id": "restaurant-1",
    "name": "Updated Restaurant Name",
    // ... other restaurant data
  },
  // ... more restaurants
]
```

#### Bulk Update Menu Items
```http
POST /api/DataManagement/menu-items/bulk
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

[
  {
    "id": "menu-1",
    "name": "Updated Menu Item Name",
    // ... other menu item data
  },
  // ... more menu items
]
```

## 🛠️ PowerShell Script Usage

### Basic Commands
```powershell
# Seed all data
.\ManageData.ps1 -Action "seed-all" -ApiBaseUrl "https://localhost:7001" -AuthToken "YOUR_TOKEN"

# Seed specific data types
.\ManageData.ps1 -Action "seed-restaurants" -ApiBaseUrl "https://localhost:7001" -AuthToken "YOUR_TOKEN"
.\ManageData.ps1 -Action "seed-menu-items" -ApiBaseUrl "https://localhost:7001" -AuthToken "YOUR_TOKEN"

# Update single restaurant from JSON file
.\ManageData.ps1 -Action "update-restaurant" -DataFile "restaurant-data.json" -ApiBaseUrl "https://localhost:7001" -AuthToken "YOUR_TOKEN"

# Update single menu item from JSON file
.\ManageData.ps1 -Action "update-menu-item" -DataFile "menu-item-data.json" -ApiBaseUrl "https://localhost:7001" -AuthToken "YOUR_TOKEN"

# Bulk update from JSON file
.\ManageData.ps1 -Action "bulk-update" -DataFile "bulk-data.json" -ApiBaseUrl "https://localhost:7001" -AuthToken "YOUR_TOKEN"

# Validate data from JSON file
.\ManageData.ps1 -Action "validate-data" -DataFile "data.json" -ApiBaseUrl "https://localhost:7001" -AuthToken "YOUR_TOKEN"
```

### Sample JSON Files

#### Single Restaurant (restaurant-data.json)
```json
{
  "id": "restaurant-new",
  "name": "New Restaurant",
  "description": "A new restaurant",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "123 New Street",
  "postalCode": "400001",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "phoneNumber": "+91-22-1234-5678",
  "email": "info@newrestaurant.com",
  "cuisineTypes": ["Indian"],
  "rating": 0.0,
  "reviewCount": 0,
  "deliveryFee": 50,
  "estimatedDeliveryTime": 30,
  "isActive": true,
  "ownerId": "vendor-1",
  "imageUrls": ["https://example.com/image.jpg"],
  "status": "Pending"
}
```

#### Single Menu Item (menu-item-data.json)
```json
{
  "id": "menu-new",
  "restaurantId": "restaurant-1",
  "name": "New Dish",
  "description": "A delicious new dish",
  "price": 250.00,
  "imageUrl": "https://example.com/dish.jpg",
  "category": "Main Course",
  "isVegetarian": true,
  "isVegan": false,
  "isGlutenFree": true,
  "isSpicy": false,
  "spiceLevel": 1,
  "allergens": [],
  "ingredients": ["Rice", "Vegetables", "Spices"],
  "preparationTime": 20,
  "isAvailable": true,
  "stockQuantity": -1,
  "variants": [
    {
      "name": "Regular",
      "priceModifier": 0,
      "isDefault": true
    }
  ],
  "tags": ["New", "Vegetarian"]
}
```

#### Bulk Data (bulk-data.json)
```json
[
  {
    "id": "restaurant-1",
    "name": "Updated Restaurant 1",
    // ... restaurant data
  },
  {
    "id": "restaurant-2",
    "name": "Updated Restaurant 2",
    // ... restaurant data
  }
]
```

## 🔍 Data Validation

### Restaurant Validation Rules
- **Name**: Required, cannot be empty
- **City**: Required, cannot be empty
- **Address**: Required, cannot be empty
- **Cuisine Types**: Required, must have at least one cuisine type
- **Rating**: Must be between 0 and 5
- **Delivery Fee**: Cannot be negative
- **Estimated Delivery Time**: Must be positive

### Menu Item Validation Rules
- **Name**: Required, cannot be empty
- **Restaurant ID**: Required, must reference valid restaurant
- **Price**: Must be positive
- **Category**: Required, cannot be empty
- **Spice Level**: Must be between 0 and 5
- **Preparation Time**: Must be positive

### Validation API
```http
POST /api/DataManagement/validate/restaurant
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  // restaurant data to validate
}
```

```http
POST /api/DataManagement/validate/menu-item
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  // menu item data to validate
}
```

## 🔄 Data Synchronization

The system automatically synchronizes data across all modules:

1. **Customer App**: Receives updated restaurant and menu information
2. **Vendor App**: Gets updated product and menu details
3. **Admin Dashboard**: Reflects all changes accurately

### Sync Process
- **Real-time Updates**: Changes are propagated immediately
- **Background Sync**: Periodic sync every 30 minutes
- **Consistency Checking**: Validates data integrity
- **Error Handling**: Graceful handling of sync failures

## 🚨 Error Handling

### Common Error Responses
```json
{
  "message": "Validation failed",
  "errors": [
    "Restaurant name is required",
    "City is required",
    "At least one cuisine type is required"
  ]
}
```

```json
{
  "message": "Restaurant not found"
}
```

```json
{
  "message": "Internal server error"
}
```

### Error Codes
- **400 Bad Request**: Validation errors or invalid data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions (e.g., non-admin trying to seed data)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## 🔐 Security

### Authentication
- All endpoints require valid authentication token
- Admin operations require admin role
- Tokens should be included in Authorization header

### Authorization
- **Restaurant Management**: Requires vendor or admin role
- **Menu Item Management**: Requires vendor or admin role
- **Data Seeding**: Requires admin role only
- **Bulk Operations**: Requires admin role only

### Input Validation
- All input data is validated before processing
- SQL injection prevention
- XSS protection
- File upload validation

## 📈 Performance

### Bulk Operations
- Efficient batch processing
- Transaction support for data consistency
- Progress tracking for large operations

### Caching
- Restaurant data cached for performance
- Menu items cached by restaurant
- Cache invalidation on updates

### Database Optimization
- Indexed queries for fast lookups
- Optimized joins for related data
- Connection pooling for scalability

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentication Errors
```
Error: 401 Unauthorized
Solution: Ensure valid authentication token is provided
```

#### 2. Validation Errors
```
Error: 400 Bad Request
Solution: Check validation rules and fix data format
```

#### 3. Resource Not Found
```
Error: 404 Not Found
Solution: Verify resource ID exists and is correct
```

#### 4. Permission Denied
```
Error: 403 Forbidden
Solution: Ensure user has required permissions/role
```

### Debug Mode
Enable detailed logging by setting log level to Debug in appsettings.json:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "GreenPantry.DataManagement": "Debug"
    }
  }
}
```

## 📞 Support

For technical support or questions:
- **Email**: support@greenpantry.com
- **Documentation**: [API Documentation](https://docs.greenpantry.com)
- **Issues**: [GitHub Issues](https://github.com/greenpantry/issues)

## 🔄 Version History

- **v1.0.0**: Initial release with basic CRUD operations
- **v1.1.0**: Added bulk operations and PowerShell script
- **v1.2.0**: Added data validation and consistency checking
- **v1.3.0**: Added real-time synchronization
