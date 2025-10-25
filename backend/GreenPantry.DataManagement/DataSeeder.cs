using GreenPantry.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace GreenPantry.DataManagement;

public class DataSeeder
{
    private readonly DataManagementService _dataManagementService;
    private readonly ILogger<DataSeeder> _logger;

    public DataSeeder(DataManagementService dataManagementService, ILogger<DataSeeder> logger)
    {
        _dataManagementService = dataManagementService;
        _logger = logger;
    }

    public async Task SeedRestaurantsAsync()
    {
        _logger.LogInformation("Seeding restaurants data...");

        var restaurants = GetSampleRestaurants();
        var success = await _dataManagementService.BulkUpdateRestaurantsAsync(restaurants);
        
        if (success)
        {
            _logger.LogInformation("Successfully seeded {Count} restaurants", restaurants.Count);
        }
        else
        {
            _logger.LogError("Failed to seed restaurants");
        }
    }

    public async Task SeedMenuItemsAsync()
    {
        _logger.LogInformation("Seeding menu items data...");

        var menuItems = GetSampleMenuItems();
        var success = await _dataManagementService.BulkUpdateMenuItemsAsync(menuItems);
        
        if (success)
        {
            _logger.LogInformation("Successfully seeded {Count} menu items", menuItems.Count);
        }
        else
        {
            _logger.LogError("Failed to seed menu items");
        }
    }

    public async Task SeedAllDataAsync()
    {
        _logger.LogInformation("Starting complete data seeding...");

        await SeedRestaurantsAsync();
        await SeedMenuItemsAsync();

        _logger.LogInformation("Data seeding completed");
    }

    private List<RestaurantData> GetSampleRestaurants()
    {
        return new List<RestaurantData>
        {
            new RestaurantData
            {
                Id = "restaurant-1",
                Name = "Spice Garden",
                Description = "Authentic North Indian cuisine with a modern twist. Specializing in biryanis, curries, and tandoor dishes.",
                ImageUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "123 Linking Road, Bandra West",
                PostalCode = "400050",
                Latitude = 19.0544,
                Longitude = 72.8406,
                PhoneNumber = "+91-22-2640-1234",
                Email = "info@spicegarden.com",
                CuisineTypes = new List<CuisineType> { CuisineType.Indian },
                Rating = 4.5,
                ReviewCount = 1250,
                DeliveryFee = 50,
                EstimatedDeliveryTime = 30,
                IsActive = true,
                OwnerId = "vendor-1",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
                },
                Status = RestaurantStatus.Approved
            },
            new RestaurantData
            {
                Id = "restaurant-2",
                Name = "Dragon Palace",
                Description = "Premium Chinese restaurant serving authentic Szechuan and Cantonese dishes. Fresh ingredients and traditional cooking methods.",
                ImageUrl = "https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "456 Juhu Tara Road, Juhu",
                PostalCode = "400049",
                Latitude = 19.1077,
                Longitude = 72.8262,
                PhoneNumber = "+91-22-2620-5678",
                Email = "contact@dragonpalace.com",
                CuisineTypes = new List<CuisineType> { CuisineType.Chinese },
                Rating = 4.3,
                ReviewCount = 890,
                DeliveryFee = 40,
                EstimatedDeliveryTime = 25,
                IsActive = true,
                OwnerId = "vendor-2",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400",
                    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"
                },
                Status = RestaurantStatus.Approved
            },
            new RestaurantData
            {
                Id = "restaurant-3",
                Name = "Bella Vista",
                Description = "Italian restaurant offering authentic pasta, pizza, and Mediterranean dishes. Fresh ingredients imported from Italy.",
                ImageUrl = "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "789 Brigade Road, MG Road",
                PostalCode = "400001",
                Latitude = 19.0760,
                Longitude = 72.8777,
                PhoneNumber = "+91-22-2204-9999",
                Email = "hello@bellavista.com",
                CuisineTypes = new List<CuisineType> { CuisineType.Italian, CuisineType.Mediterranean },
                Rating = 4.7,
                ReviewCount = 2100,
                DeliveryFee = 60,
                EstimatedDeliveryTime = 35,
                IsActive = true,
                OwnerId = "vendor-3",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400",
                    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"
                },
                Status = RestaurantStatus.Approved
            },
            new RestaurantData
            {
                Id = "restaurant-4",
                Name = "Thai Corner",
                Description = "Authentic Thai cuisine with fresh herbs and spices. Specializing in pad thai, curries, and traditional Thai dishes.",
                ImageUrl = "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "321 Indiranagar, 100 Feet Road",
                PostalCode = "400076",
                Latitude = 19.1183,
                Longitude = 72.9060,
                PhoneNumber = "+91-22-2651-2345",
                Email = "info@thaicorner.com",
                CuisineTypes = new List<CuisineType> { CuisineType.Thai },
                Rating = 4.4,
                ReviewCount = 680,
                DeliveryFee = 45,
                EstimatedDeliveryTime = 28,
                IsActive = true,
                OwnerId = "vendor-4",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
                    "https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400"
                },
                Status = RestaurantStatus.Approved
            },
            new RestaurantData
            {
                Id = "restaurant-5",
                Name = "Burger Junction",
                Description = "American-style burgers with premium ingredients. Fresh beef patties, artisanal buns, and creative toppings.",
                ImageUrl = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "555 Andheri West, Link Road",
                PostalCode = "400058",
                Latitude = 19.1136,
                Longitude = 72.8697,
                PhoneNumber = "+91-22-2624-8888",
                Email = "orders@burgerjunction.com",
                CuisineTypes = new List<CuisineType> { CuisineType.American },
                Rating = 4.2,
                ReviewCount = 450,
                DeliveryFee = 35,
                EstimatedDeliveryTime = 20,
                IsActive = true,
                OwnerId = "vendor-5",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
                },
                Status = RestaurantStatus.Approved
            },
            new RestaurantData
            {
                Id = "restaurant-6",
                Name = "Taco Fiesta",
                Description = "Mexican restaurant serving authentic tacos, burritos, and quesadillas. Fresh ingredients and traditional recipes.",
                ImageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "321 Powai, Hiranandani Gardens",
                PostalCode = "400076",
                Latitude = 19.1183,
                Longitude = 72.9060,
                PhoneNumber = "+91-22-2570-1234",
                Email = "hola@tacofiesta.com",
                CuisineTypes = new List<CuisineType> { CuisineType.Mexican },
                Rating = 4.1,
                ReviewCount = 320,
                DeliveryFee = 40,
                EstimatedDeliveryTime = 25,
                IsActive = true,
                OwnerId = "vendor-6",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
                    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"
                },
                Status = RestaurantStatus.Approved
            },
            new RestaurantData
            {
                Id = "restaurant-7",
                Name = "Sushi Master",
                Description = "Authentic Japanese sushi and sashimi. Fresh fish daily, traditional preparation methods, and premium ingredients.",
                ImageUrl = "https://images.unsplash.com/photo-1579584421775-5c4d86c6a034?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "888 Marine Drive, Nariman Point",
                PostalCode = "400021",
                Latitude = 18.9333,
                Longitude = 72.8333,
                PhoneNumber = "+91-22-2202-3333",
                Email = "info@sushimaster.com",
                CuisineTypes = new List<CuisineType> { CuisineType.Japanese },
                Rating = 4.8,
                ReviewCount = 1500,
                DeliveryFee = 80,
                EstimatedDeliveryTime = 40,
                IsActive = true,
                OwnerId = "vendor-7",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1579584421775-5c4d86c6a034?w=400",
                    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"
                },
                Status = RestaurantStatus.Approved
            },
            new RestaurantData
            {
                Id = "restaurant-8",
                Name = "Mediterranean Breeze",
                Description = "Fresh Mediterranean cuisine with Greek and Lebanese influences. Healthy, flavorful dishes with olive oil and fresh herbs.",
                ImageUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "456 Bandra Kurla Complex",
                PostalCode = "400051",
                Latitude = 19.0656,
                Longitude = 72.8714,
                PhoneNumber = "+91-22-2656-7777",
                Email = "info@medbreeze.com",
                CuisineTypes = new List<CuisineType> { CuisineType.Mediterranean, CuisineType.Greek },
                Rating = 4.6,
                ReviewCount = 920,
                DeliveryFee = 55,
                EstimatedDeliveryTime = 32,
                IsActive = true,
                OwnerId = "vendor-8",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
                    "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400"
                },
                Status = RestaurantStatus.Approved
            },
            new RestaurantData
            {
                Id = "restaurant-9",
                Name = "Korean BBQ House",
                Description = "Authentic Korean barbecue and traditional dishes. Premium meats, fresh vegetables, and traditional Korean flavors.",
                ImageUrl = "https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "123 Koregaon Park, Pune",
                PostalCode = "411001",
                Latitude = 18.5204,
                Longitude = 73.8567,
                PhoneNumber = "+91-20-2612-3456",
                Email = "info@koreanbbq.com",
                CuisineTypes = new List<CuisineType> { CuisineType.Korean },
                Rating = 4.3,
                ReviewCount = 580,
                DeliveryFee = 50,
                EstimatedDeliveryTime = 35,
                IsActive = true,
                OwnerId = "vendor-9",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400",
                    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"
                },
                Status = RestaurantStatus.Approved
            },
            new RestaurantData
            {
                Id = "restaurant-10",
                Name = "French Bistro",
                Description = "Classic French bistro cuisine with modern presentation. Coq au vin, bouillabaisse, and traditional French desserts.",
                ImageUrl = "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
                City = "Mumbai",
                State = "Maharashtra",
                Address = "789 Colaba Causeway",
                PostalCode = "400005",
                Latitude = 18.9220,
                Longitude = 72.8341,
                PhoneNumber = "+91-22-2282-1111",
                Email = "bonjour@frenchbistro.com",
                CuisineTypes = new List<CuisineType> { CuisineType.French },
                Rating = 4.9,
                ReviewCount = 1800,
                DeliveryFee = 70,
                EstimatedDeliveryTime = 45,
                IsActive = true,
                OwnerId = "vendor-10",
                ImageUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
                    "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400"
                },
                Status = RestaurantStatus.Approved
            }
        };
    }

    private List<MenuItemData> GetSampleMenuItems()
    {
        return new List<MenuItemData>
        {
            // Spice Garden (Indian) - restaurant-1
            new MenuItemData
            {
                Id = "menu-1",
                RestaurantId = "restaurant-1",
                Name = "Chicken Biryani",
                Description = "Fragrant basmati rice cooked with tender chicken pieces, aromatic spices, and saffron",
                Price = 350,
                ImageUrl = "https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400",
                Category = "Main Course",
                IsVegetarian = false,
                IsVegan = false,
                IsGlutenFree = true,
                IsSpicy = true,
                SpiceLevel = 3,
                Allergens = new List<string> { "Dairy" },
                Ingredients = new List<string> { "Basmati Rice", "Chicken", "Onions", "Yogurt", "Saffron", "Cardamom", "Cinnamon" },
                PreparationTime = 45,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "Regular", PriceModifier = 0, IsDefault = true },
                    new MenuItemVariantData { Name = "Extra Spicy", PriceModifier = 20, IsDefault = false }
                },
                Tags = new List<string> { "Popular", "Spicy", "Traditional" }
            },
            new MenuItemData
            {
                Id = "menu-2",
                RestaurantId = "restaurant-1",
                Name = "Dal Makhani",
                Description = "Creamy black lentils slow-cooked with butter and cream, served with naan",
                Price = 280,
                ImageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
                Category = "Main Course",
                IsVegetarian = true,
                IsVegan = false,
                IsGlutenFree = true,
                IsSpicy = false,
                SpiceLevel = 1,
                Allergens = new List<string> { "Dairy" },
                Ingredients = new List<string> { "Black Lentils", "Butter", "Cream", "Tomatoes", "Onions", "Ginger", "Garlic" },
                PreparationTime = 30,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "Regular", PriceModifier = 0, IsDefault = true },
                    new MenuItemVariantData { Name = "Extra Creamy", PriceModifier = 30, IsDefault = false }
                },
                Tags = new List<string> { "Vegetarian", "Creamy", "Comfort Food" }
            },
            new MenuItemData
            {
                Id = "menu-3",
                RestaurantId = "restaurant-1",
                Name = "Tandoori Chicken",
                Description = "Marinated chicken cooked in traditional tandoor oven, served with mint chutney",
                Price = 420,
                ImageUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
                Category = "Main Course",
                IsVegetarian = false,
                IsVegan = false,
                IsGlutenFree = true,
                IsSpicy = true,
                SpiceLevel = 2,
                Allergens = new List<string> { "Dairy" },
                Ingredients = new List<string> { "Chicken", "Yogurt", "Ginger", "Garlic", "Red Chili", "Turmeric", "Cumin" },
                PreparationTime = 25,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "Half", PriceModifier = -100, IsDefault = false },
                    new MenuItemVariantData { Name = "Full", PriceModifier = 0, IsDefault = true }
                },
                Tags = new List<string> { "Tandoor", "Spicy", "Traditional" }
            },

            // Dragon Palace (Chinese) - restaurant-2
            new MenuItemData
            {
                Id = "menu-4",
                RestaurantId = "restaurant-2",
                Name = "Chicken Manchurian",
                Description = "Crispy chicken balls in tangy Manchurian sauce with vegetables",
                Price = 320,
                ImageUrl = "https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400",
                Category = "Main Course",
                IsVegetarian = false,
                IsVegan = false,
                IsGlutenFree = false,
                IsSpicy = true,
                SpiceLevel = 2,
                Allergens = new List<string> { "Gluten", "Soy" },
                Ingredients = new List<string> { "Chicken", "Cornflour", "Soy Sauce", "Ginger", "Garlic", "Bell Peppers", "Onions" },
                PreparationTime = 20,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "Regular", PriceModifier = 0, IsDefault = true },
                    new MenuItemVariantData { Name = "Extra Spicy", PriceModifier = 25, IsDefault = false }
                },
                Tags = new List<string> { "Indo-Chinese", "Spicy", "Popular" }
            },
            new MenuItemData
            {
                Id = "menu-5",
                RestaurantId = "restaurant-2",
                Name = "Fried Rice",
                Description = "Steamed rice stir-fried with vegetables, eggs, and choice of protein",
                Price = 200,
                ImageUrl = "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
                Category = "Main Course",
                IsVegetarian = true,
                IsVegan = false,
                IsGlutenFree = true,
                IsSpicy = false,
                SpiceLevel = 1,
                Allergens = new List<string> { "Eggs" },
                Ingredients = new List<string> { "Rice", "Eggs", "Carrots", "Beans", "Onions", "Spring Onions", "Soy Sauce" },
                PreparationTime = 15,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "Vegetable", PriceModifier = 0, IsDefault = true },
                    new MenuItemVariantData { Name = "Chicken", PriceModifier = 50, IsDefault = false },
                    new MenuItemVariantData { Name = "Prawn", PriceModifier = 80, IsDefault = false }
                },
                Tags = new List<string> { "Quick", "Vegetarian", "Comfort Food" }
            },

            // Bella Vista (Italian) - restaurant-3
            new MenuItemData
            {
                Id = "menu-6",
                RestaurantId = "restaurant-3",
                Name = "Margherita Pizza",
                Description = "Classic Italian pizza with tomato sauce, mozzarella, and fresh basil",
                Price = 450,
                ImageUrl = "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400",
                Category = "Pizza",
                IsVegetarian = true,
                IsVegan = false,
                IsGlutenFree = false,
                IsSpicy = false,
                SpiceLevel = 0,
                Allergens = new List<string> { "Gluten", "Dairy" },
                Ingredients = new List<string> { "Pizza Dough", "Tomato Sauce", "Mozzarella", "Fresh Basil", "Olive Oil" },
                PreparationTime = 20,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "Small (10\")", PriceModifier = -100, IsDefault = false },
                    new MenuItemVariantData { Name = "Medium (12\")", PriceModifier = 0, IsDefault = true },
                    new MenuItemVariantData { Name = "Large (14\")", PriceModifier = 100, IsDefault = false }
                },
                Tags = new List<string> { "Classic", "Vegetarian", "Traditional" }
            },
            new MenuItemData
            {
                Id = "menu-7",
                RestaurantId = "restaurant-3",
                Name = "Caesar Salad",
                Description = "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese",
                Price = 280,
                ImageUrl = "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
                Category = "Salad",
                IsVegetarian = true,
                IsVegan = false,
                IsGlutenFree = false,
                IsSpicy = false,
                SpiceLevel = 0,
                Allergens = new List<string> { "Dairy", "Gluten", "Eggs" },
                Ingredients = new List<string> { "Romaine Lettuce", "Caesar Dressing", "Croutons", "Parmesan Cheese", "Lemon" },
                PreparationTime = 10,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "Regular", PriceModifier = 0, IsDefault = true },
                    new MenuItemVariantData { Name = "With Grilled Chicken", PriceModifier = 80, IsDefault = false }
                },
                Tags = new List<string> { "Fresh", "Healthy", "Classic" }
            },

            // Thai Corner (Thai) - restaurant-4
            new MenuItemData
            {
                Id = "menu-8",
                RestaurantId = "restaurant-4",
                Name = "Pad Thai",
                Description = "Stir-fried rice noodles with shrimp, tofu, bean sprouts, and tamarind sauce",
                Price = 380,
                ImageUrl = "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
                Category = "Noodles",
                IsVegetarian = false,
                IsVegan = false,
                IsGlutenFree = true,
                IsSpicy = true,
                SpiceLevel = 2,
                Allergens = new List<string> { "Shellfish", "Soy", "Peanuts" },
                Ingredients = new List<string> { "Rice Noodles", "Shrimp", "Tofu", "Bean Sprouts", "Tamarind", "Fish Sauce", "Peanuts" },
                PreparationTime = 18,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "With Shrimp", PriceModifier = 0, IsDefault = true },
                    new MenuItemVariantData { Name = "Vegetarian", PriceModifier = -50, IsDefault = false },
                    new MenuItemVariantData { Name = "Extra Spicy", PriceModifier = 30, IsDefault = false }
                },
                Tags = new List<string> { "Popular", "Spicy", "Traditional" }
            },

            // Burger Junction (American) - restaurant-5
            new MenuItemData
            {
                Id = "menu-9",
                RestaurantId = "restaurant-5",
                Name = "Classic Cheeseburger",
                Description = "Beef patty with cheese, lettuce, tomato, onion, and special sauce on brioche bun",
                Price = 250,
                ImageUrl = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
                Category = "Burger",
                IsVegetarian = false,
                IsVegan = false,
                IsGlutenFree = false,
                IsSpicy = false,
                SpiceLevel = 0,
                Allergens = new List<string> { "Gluten", "Dairy", "Eggs" },
                Ingredients = new List<string> { "Beef Patty", "Cheese", "Lettuce", "Tomato", "Onion", "Pickles", "Brioche Bun" },
                PreparationTime = 15,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "Single Patty", PriceModifier = 0, IsDefault = true },
                    new MenuItemVariantData { Name = "Double Patty", PriceModifier = 80, IsDefault = false }
                },
                Tags = new List<string> { "Classic", "Popular", "Comfort Food" }
            },

            // Taco Fiesta (Mexican) - restaurant-6
            new MenuItemData
            {
                Id = "menu-10",
                RestaurantId = "restaurant-6",
                Name = "Chicken Tacos",
                Description = "Soft corn tortillas filled with seasoned chicken, lettuce, cheese, and salsa",
                Price = 180,
                ImageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
                Category = "Tacos",
                IsVegetarian = false,
                IsVegan = false,
                IsGlutenFree = true,
                IsSpicy = true,
                SpiceLevel = 2,
                Allergens = new List<string> { "Dairy" },
                Ingredients = new List<string> { "Corn Tortillas", "Chicken", "Lettuce", "Cheese", "Tomatoes", "Onions", "Cilantro" },
                PreparationTime = 12,
                IsAvailable = true,
                StockQuantity = -1,
                Variants = new List<MenuItemVariantData>
                {
                    new MenuItemVariantData { Name = "2 Tacos", PriceModifier = 0, IsDefault = true },
                    new MenuItemVariantData { Name = "3 Tacos", PriceModifier = 60, IsDefault = false },
                    new MenuItemVariantData { Name = "Extra Spicy", PriceModifier = 20, IsDefault = false }
                },
                Tags = new List<string> { "Spicy", "Quick", "Traditional" }
            }
        };
    }
}
