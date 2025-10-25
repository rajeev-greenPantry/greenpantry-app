using GreenPantry.Application.DTOs.Geolocation;

namespace GreenPantry.Application.Interfaces;

public interface IGeolocationService
{
    Task<GeolocationResponse> GetLocationFromCoordinatesAsync(double latitude, double longitude);
    Task<GeolocationResponse> GetLocationFromIPAsync(string ipAddress);
}
