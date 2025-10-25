# GreenPantry Data Management System

This module provides comprehensive data management capabilities for the GreenPantry food delivery platform, including restaurants, cuisines, and products (menu items).

## Features

### 🏪 Restaurant Management
- **Create/Update Restaurants**: Add new restaurants or update existing ones with complete details
- **Cuisine Management**: Assign and update cuisine types for restaurants
- **Status Management**: Update restaurant status (Active, Inactive, Pending, Approved, Suspended, Closed)
- **Location Management**: Handle address, coordinates, and delivery areas
- **Contact Information**: Manage phone numbers, emails, and other contact details

### 🍽️ Menu Item Management
- **Create/Update Products**: Add new menu items or update existing ones
- **Availability Management**: Toggle item availability and stock levels
- **Price Management**: Update prices and handle price modifications
- **Category Management**: Organize items by categories (Main Course, Appetizers, Desserts, etc.)
- **Dietary Information**: Track vegetarian, vegan, gluten-free, and allergen information
- **Variants**: Handle different sizes, spice levels, and customizations

### 🔄 Data Synchronization
- **Real-time Sync**: Automatic synchronization across all modules
- **Consistency Checking**: Validate data integrity and relationships
- **Bulk Operations**: Efficiently handle large-scale data updates
- **Data Validation**: Comprehensive validation rules for all data types

## API Endpoints

### Restaurant Management

#### Create/Update Restaurant
```http
POST /api/DataManagement/restaurants
Content-Type: application/json

{
  "id": "restaurant-1",
  "name": "Spice Garden",
  "description": "Authentic North Indian cuisine",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "123 Linking Road, Bandra West",
  "postalCode": "400050",
  "latitude": 19.0544,
  "longitude": 72.8406,
  "phoneNumber": "+91-22-2640-1234",
  "email": "info@spicegarden.com",
  "cuisineTypes": ["Indian"],
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

#### Update Restaurant Cuisines
```http
PUT /api/DataManagement/restaurants/{restaurantId}/cuisines
Content-Type: application/json

["Indian", "Chinese", "Thai"]
```

#### Update Restaurant Status
```http
PUT /api/DataManagement/restaurants/{restaurantId}/status
Content-Type: application/json

"Approved"
```

### Menu Item Management

#### Create/Update Menu Item
```http
POST /api/DataManagement/menu-items
Content-Type: application/json

{
  "id": "menu-1",
  "restaurantId": "restaurant-1",
  "name": "Chicken Biryani",
  "description": "Fragrant basmati rice with tender chicken",
  "price": 350,
  "imageUrl": "https://example.com/biryani.jpg",
  "category": "Main Course",
  "isVegetarian": false,
  "isVegan": false,
  "isGlutenFree": true,
  "isSpicy": true,
  "spiceLevel": 3,
  "allergens": ["Dairy"],
  "ingredients": ["Basmati Rice", "Chicken", "Onions", "Yogurt"],
  "preparationTime": 45,
  "isAvailable": true,
  "stockQuantity": -1,
  "variants": [
    {
      "name": "Regular",
      "priceModifier": 0,
      "isDefault": true
    },
    {
      "name": "Extra Spicy",
      "priceModifier": 20,
      "isDefault": false
    }
  ],
  "tags": ["Popular", "Spicy", "Traditional"]
}
```

#### Update Menu Item Availability
```http
PUT /api/DataManagement/menu-items/{menuItemId}/availability
Content-Type: application/json

true
```

#### Update Menu Item Price
```http
PUT /api/DataManagement/menu-items/{menuItemId}/price
Content-Type: application/json

375.00
```

#### Update Menu Item Stock
```http
PUT /api/DataManagement/menu-items/{menuItemId}/stock
Content-Type: application/json

50
```

### Bulk Operations

#### Bulk Update Restaurants
```http
POST /api/DataManagement/restaurants/bulk
Content-Type: application/json

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

[
  {
    "id": "menu-1",
    "name": "Updated Menu Item Name",
    // ... other menu item data
  },
  // ... more menu items
]
```

### Data Seeding (Admin Only)

#### Seed All Data
```http
POST /api/DataManagement/seed/all
Authorization: Bearer {admin-token}
```

#### Seed Restaurants Only
```http
POST /api/DataManagement/seed/restaurants
Authorization: Bearer {admin-token}
```

#### Seed Menu Items Only
```http
POST /api/DataManagement/seed/menu-items
Authorization: Bearer {admin-token}
```

### Data Validation

#### Validate Restaurant Data
```http
POST /api/DataManagement/validate/restaurant
Content-Type: application/json

{
  // restaurant data to validate
}
```

#### Validate Menu Item Data
```http
POST /api/DataManagement/validate/menu-item
Content-Type: application/json

{
  // menu item data to validate
}
```

## Data Models

### RestaurantData
- **Basic Info**: Name, description, image URL
- **Location**: City, state, address, postal code, coordinates
- **Contact**: Phone number, email
- **Cuisine**: List of cuisine types
- **Metrics**: Rating, review count, delivery fee, estimated delivery time
- **Status**: Active/inactive, approval status
- **Owner**: Owner ID for vendor management
- **Images**: Multiple image URLs

### MenuItemData
- **Basic Info**: Name, description, price, image URL
- **Restaurant**: Restaurant ID reference
- **Category**: Menu category (Main Course, Appetizers, etc.)
- **Dietary**: Vegetarian, vegan, gluten-free flags
- **Spice**: Spicy flag and spice level (0-5)
- **Allergens**: List of allergens
- **Ingredients**: List of ingredients
- **Preparation**: Preparation time in minutes
- **Availability**: Available flag and stock quantity
- **Variants**: Different sizes, spice levels, customizations
- **Tags**: Searchable tags

## Usage Examples

### Adding a New Restaurant
```csharp
var restaurantData = new RestaurantData
{
    Id = "restaurant-new",
    Name = "New Restaurant",
    Description = "A new restaurant description",
    City = "Mumbai",
    State = "Maharashtra",
    Address = "123 New Street",
    PostalCode = "400001",
    Latitude = 19.0760,
    Longitude = 72.8777,
    PhoneNumber = "+91-22-1234-5678",
    Email = "info@newrestaurant.com",
    CuisineTypes = new List<CuisineType> { CuisineType.Indian },
    Rating = 0.0,
    ReviewCount = 0,
    DeliveryFee = 50,
    EstimatedDeliveryTime = 30,
    IsActive = true,
    OwnerId = "vendor-1",
    ImageUrls = new List<string> { "https://example.com/image.jpg" },
    Status = RestaurantStatus.Pending
};

var restaurant = await dataManagementService.CreateOrUpdateRestaurantAsync(restaurantData);
```

### Adding a New Menu Item
```csharp
var menuItemData = new MenuItemData
{
    Id = "menu-new",
    RestaurantId = "restaurant-1",
    Name = "New Dish",
    Description = "A delicious new dish",
    Price = 250,
    ImageUrl = "https://example.com/dish.jpg",
    Category = "Main Course",
    IsVegetarian = true,
    IsVegan = false,
    IsGlutenFree = true,
    IsSpicy = false,
    SpiceLevel = 1,
    Allergens = new List<string>(),
    Ingredients = new List<string> { "Rice", "Vegetables", "Spices" },
    PreparationTime = 20,
    IsAvailable = true,
    StockQuantity = -1,
    Variants = new List<MenuItemVariantData>
    {
        new MenuItemVariantData { Name = "Regular", PriceModifier = 0, IsDefault = true }
    },
    Tags = new List<string> { "New", "Vegetarian" }
};

var menuItem = await dataManagementService.CreateOrUpdateMenuItemAsync(menuItemData);
```

### Bulk Updating Restaurants
```csharp
var restaurantsData = new List<RestaurantData>
{
    // ... multiple restaurant data objects
};

var success = await dataManagementService.BulkUpdateRestaurantsAsync(restaurantsData);
```

## Data Consistency

The system includes automatic data consistency checking:

1. **Restaurant Validation**: Ensures all required fields are present and valid
2. **Menu Item Validation**: Validates price, category, and other required fields
3. **Cross-Reference Validation**: Ensures menu items reference valid restaurants
4. **Real-time Sync**: Keeps all modules synchronized with the latest data

## Security

- All endpoints require authentication
- Admin-only operations (like data seeding) require admin role
- Input validation prevents malicious data injection
- Audit logging for all data changes

## Performance

- Bulk operations for efficient large-scale updates
- Background sync service for real-time updates
- Optimized database queries
- Caching support for frequently accessed data

## Error Handling

- Comprehensive validation with detailed error messages
- Graceful error handling with appropriate HTTP status codes
- Logging for debugging and monitoring
- Rollback support for failed bulk operations
