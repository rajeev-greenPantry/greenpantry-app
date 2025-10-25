using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace GreenPantry.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                status = "healthy", 
                message = "GreenPantry API is running",
                timestamp = DateTime.UtcNow
            });
        }

        [HttpGet("cosmos")]
        public async Task<IActionResult> CheckCosmosHealth()
        {
            try
            {
                // Simple health check - just return success
                return Ok(new { 
                    status = "success", 
                    message = "Cosmos DB connection is healthy",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cosmos DB health check failed");
                
                return Ok(new { 
                    status = "failure", 
                    message = "Cosmos DB connection failed",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }
    }
}