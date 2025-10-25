using GreenPantry.Application.DTOs.Geolocation;
using GreenPantry.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GreenPantry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GeolocationController : ControllerBase
{
    private readonly IGeolocationService _geolocationService;
    private readonly ILogger<GeolocationController> _logger;

    public GeolocationController(IGeolocationService geolocationService, ILogger<GeolocationController> logger)
    {
        _geolocationService = geolocationService;
        _logger = logger;
    }

    [HttpPost("coordinates")]
    public async Task<ActionResult<GeolocationResponse>> GetLocationFromCoordinates([FromBody] CoordinatesRequest request)
    {
        try
        {
            var result = await _geolocationService.GetLocationFromCoordinatesAsync(request.Latitude, request.Longitude);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting location from coordinates");
            return StatusCode(500, new { message = "An error occurred while getting location information" });
        }
    }

    [HttpPost("ip")]
    public async Task<ActionResult<GeolocationResponse>> GetLocationFromIP([FromBody] IPRequest request)
    {
        try
        {
            var result = await _geolocationService.GetLocationFromIPAsync(request.IPAddress);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting location from IP");
            return StatusCode(500, new { message = "An error occurred while getting location information" });
        }
    }

    [HttpGet("current")]
    public async Task<ActionResult<GeolocationResponse>> GetCurrentLocation()
    {
        try
        {
            // Get client IP address
            var ipAddress = GetClientIPAddress();
            _logger.LogInformation("Getting location for IP: {IPAddress}", ipAddress);
            
            // For localhost/development, return a default location (Mumbai)
            if (ipAddress == "127.0.0.1" || ipAddress == "::1" || string.IsNullOrEmpty(ipAddress))
            {
                _logger.LogInformation("Localhost detected, returning default Mumbai location");
                return Ok(new GeolocationResponse
                {
                    Latitude = 19.0760,
                    Longitude = 72.8777,
                    Street = "Default Street",
                    City = "Mumbai",
                    State = "Maharashtra",
                    PostalCode = "400001",
                    Country = "India",
                    CountryCode = "in",
                    FormattedAddress = "Mumbai, Maharashtra, India"
                });
            }
            
            var result = await _geolocationService.GetLocationFromIPAsync(ipAddress);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Geolocation service failed, returning default location");
            return Ok(new GeolocationResponse
            {
                Latitude = 19.0760,
                Longitude = 72.8777,
                Street = "Default Street",
                City = "Mumbai",
                State = "Maharashtra",
                PostalCode = "400001",
                Country = "India",
                CountryCode = "in",
                FormattedAddress = "Mumbai, Maharashtra, India"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current location");
            return StatusCode(500, new { message = "An error occurred while getting current location" });
        }
    }

    private string GetClientIPAddress()
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        
        // Check for forwarded headers (in case of proxy/load balancer)
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',').FirstOrDefault()?.Trim();
        }
        else if (Request.Headers.ContainsKey("X-Real-IP"))
        {
            ipAddress = Request.Headers["X-Real-IP"].FirstOrDefault();
        }

        // Fallback to localhost for development
        return ipAddress ?? "127.0.0.1";
    }
}

public class CoordinatesRequest
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class IPRequest
{
    public string IPAddress { get; set; } = string.Empty;
}
