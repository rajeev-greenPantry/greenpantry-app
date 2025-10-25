# Cosmos DB Setup Instructions

## Database Configuration

1. **Database Name**: `GreenPantryDB`

2. **Containers to Create**:

### Users Container
- **Container Name**: `Users`
- **Partition Key**: `/id`
- **Throughput**: 400 RU/s (minimum)
- **Indexing Policy**: Automatic

### Restaurants Container
- **Container Name**: `Restaurants`
- **Partition Key**: `/city`
- **Throughput**: 400 RU/s (minimum)
- **Indexing Policy**: Automatic

### Menus Container
- **Container Name**: `Menus`
- **Partition Key**: `/restaurantId`
- **Throughput**: 400 RU/s (minimum)
- **Indexing Policy**: Automatic

### Orders Container
- **Container Name**: `Orders`
- **Partition Key**: `/userId`
- **Throughput**: 400 RU/s (minimum)
- **Indexing Policy**: Automatic

## Sample Data

Import the sample data from the following files:
- `sample-data/users.json`
- `sample-data/restaurants.json`
- `sample-data/menus.json`
- `sample-data/orders.json`

## Connection String

Update the connection string in `backend/GreenPantry.API/appsettings.json`:

```json
{
  "CosmosDb": {
    "ConnectionString": "AccountEndpoint=https://your-cosmos-account.documents.azure.com:443/;AccountKey=your-account-key;",
    "DatabaseName": "GreenPantryDB"
  }
}
```

## Performance Optimization

### Partition Key Strategy
- **Users**: Partitioned by `id` for even distribution
- **Restaurants**: Partitioned by `city` for location-based queries
- **Menus**: Partitioned by `restaurantId` for restaurant-specific menu queries
- **Orders**: Partitioned by `userId` for user-specific order queries

### Query Patterns
- Most queries will be scoped to a single partition
- Cross-partition queries are minimized
- Indexes are automatically created for frequently queried fields
