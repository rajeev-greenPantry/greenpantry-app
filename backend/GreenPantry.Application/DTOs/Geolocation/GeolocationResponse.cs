namespace GreenPantry.Application.DTOs.Geolocation;

public class GeolocationResponse
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string FormattedAddress { get; set; } = string.Empty;
}
