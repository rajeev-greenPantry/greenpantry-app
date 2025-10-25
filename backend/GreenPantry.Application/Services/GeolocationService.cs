using GreenPantry.Application.DTOs.Geolocation;
using GreenPantry.Application.Interfaces;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace GreenPantry.Application.Services;

public class GeolocationService : IGeolocationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GeolocationService> _logger;

    public GeolocationService(HttpClient httpClient, ILogger<GeolocationService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<GeolocationResponse> GetLocationFromCoordinatesAsync(double latitude, double longitude)
    {
        try
        {
            _logger.LogInformation("Getting location for coordinates: {Latitude}, {Longitude}", latitude, longitude);

            // Using OpenStreetMap Nominatim API (free, no API key required)
            var url = $"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}&addressdetails=1&accept-language=en";
            
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "GreenPantry/1.0");
            
            var response = await _httpClient.GetStringAsync(url);
            var data = JsonSerializer.Deserialize<JsonElement>(response);

            if (data.ValueKind == JsonValueKind.Null || !data.TryGetProperty("address", out var address))
            {
                throw new InvalidOperationException("No address data found");
            }

            var result = new GeolocationResponse
            {
                Latitude = latitude,
                Longitude = longitude,
                Street = GetAddressComponent(address, "house_number", "road", "suburb"),
                City = GetAddressComponent(address, "city", "town", "village", "county"),
                State = GetAddressComponent(address, "state", "region"),
                PostalCode = GetAddressComponent(address, "postcode"),
                Country = GetAddressComponent(address, "country"),
                CountryCode = GetAddressComponent(address, "country_code"),
                FormattedAddress = data.TryGetProperty("display_name", out var displayName) ? displayName.GetString() ?? "" : ""
            };

            _logger.LogInformation("Successfully retrieved location: {City}, {State}, {Country}", result.City, result.State, result.Country);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting location from coordinates: {Latitude}, {Longitude}", latitude, longitude);
            throw new InvalidOperationException("Failed to get location information", ex);
        }
    }

    public async Task<GeolocationResponse> GetLocationFromIPAsync(string ipAddress)
    {
        try
        {
            _logger.LogInformation("Getting location for IP: {IPAddress}", ipAddress);

            // Using ipapi.co (free tier: 1000 requests/day)
            var url = $"http://ipapi.co/{ipAddress}/json/";
            
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "GreenPantry/1.0");
            
            var response = await _httpClient.GetStringAsync(url);
            var data = JsonSerializer.Deserialize<JsonElement>(response);

            if (data.ValueKind == JsonValueKind.Null)
            {
                throw new InvalidOperationException("No location data found for IP");
            }

            var result = new GeolocationResponse
            {
                Latitude = data.TryGetProperty("latitude", out var lat) ? lat.GetDouble() : 0,
                Longitude = data.TryGetProperty("longitude", out var lon) ? lon.GetDouble() : 0,
                Street = "", // IP geolocation doesn't provide street-level accuracy
                City = data.TryGetProperty("city", out var city) ? city.GetString() ?? "" : "",
                State = data.TryGetProperty("region", out var region) ? region.GetString() ?? "" : "",
                PostalCode = data.TryGetProperty("postal", out var postal) ? postal.GetString() ?? "" : "",
                Country = data.TryGetProperty("country_name", out var country) ? country.GetString() ?? "" : "",
                CountryCode = data.TryGetProperty("country_code", out var countryCode) ? countryCode.GetString() ?? "" : "",
                FormattedAddress = GetFormattedAddress(data)
            };

            _logger.LogInformation("Successfully retrieved location from IP: {City}, {State}, {Country}", result.City, result.State, result.Country);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting location from IP: {IPAddress}", ipAddress);
            throw new InvalidOperationException("Failed to get location information from IP", ex);
        }
    }

    private static string GetAddressComponent(JsonElement address, params string[] propertyNames)
    {
        foreach (var propertyName in propertyNames)
        {
            if (address.TryGetProperty(propertyName, out var property) && property.ValueKind != JsonValueKind.Null)
            {
                return property.GetString() ?? "";
            }
        }
        return "";
    }

    private static string GetFormattedAddress(JsonElement data)
    {
        var city = data.TryGetProperty("city", out var cityProp) ? cityProp.GetString() ?? "" : "";
        var region = data.TryGetProperty("region", out var regionProp) ? regionProp.GetString() ?? "" : "";
        var country = data.TryGetProperty("country_name", out var countryProp) ? countryProp.GetString() ?? "" : "";
        
        var parts = new[] { city, region, country }.Where(p => !string.IsNullOrEmpty(p));
        return string.Join(", ", parts);
    }
}
