using GreenPantry.Application.DTOs.Auth;
using GreenPantry.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using GreenPantry.Infrastructure.Data;

namespace GreenPantry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly IUserRepository _userRepository;

    public AuthController(IAuthService authService, ILogger<AuthController> logger, IUserRepository userRepository)
    {
        _authService = authService;
        _logger = logger;
        _userRepository = userRepository;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        try
        {
            var response = await _authService.RegisterAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user registration");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user login");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var response = await _authService.RefreshTokenAsync(request.RefreshToken);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, new { message = "An error occurred during token refresh" });
        }
    }

    [HttpPost("logout")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult> Logout()
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            await _authService.LogoutAsync(userId);
            return Ok(new { message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, new { message = "An error occurred during logout" });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            await _authService.RequestPasswordResetAsync(request.Email);
            return Ok(new { message = "If an account with that email exists, a password reset link has been sent." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password request");
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            var success = await _authService.ResetPasswordAsync(request.UserId, request.Token, request.NewPassword);
            
            if (!success)
            {
                return BadRequest(new { message = "Invalid or expired reset token" });
            }

            return Ok(new { message = "Password reset successful" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset");
            return StatusCode(500, new { message = "An error occurred while resetting your password" });
        }
    }

    [HttpGet("test-users")]
    public async Task<ActionResult> GetTestUsers()
    {
        try
        {
            var users = await _userRepository.GetAllAsync();
            var userEmails = users.Select(u => new { u.Email, u.Id }).ToList();
            return Ok(userEmails);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, new { message = "Error getting users" });
        }
    }

    [HttpPost("admin/reset-password")]
    public async Task<ActionResult> AdminResetPassword([FromBody] AdminPasswordResetRequest request)
    {
        try
        {
            var user = await _userRepository.GetByEmailAsync(request.Email.ToLowerInvariant());
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            await _authService.ResetPasswordDirectlyAsync(user.Id, request.NewPassword);
            
            return Ok(new { message = "Password reset successfully", newPassword = request.NewPassword });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during admin password reset");
            return StatusCode(500, new { message = "An error occurred while resetting the password" });
        }
    }

    [HttpPost("fix-password")]
    public async Task<ActionResult> FixPasswordByEmail([FromBody] AdminPasswordResetRequest request)
    {
        try
        {
            // Try different email formats
            var emailVariations = new[]
            {
                request.Email.ToLowerInvariant(),
                request.Email,
                request.Email.ToUpperInvariant()
            };

            foreach (var email in emailVariations)
            {
                try
                {
                    var user = await _userRepository.GetByEmailAsync(email);
                    if (user != null)
                    {
                        _logger.LogInformation("Found user with email variation: {Email}", email);
                        await _authService.ResetPasswordDirectlyAsync(user.Id, request.NewPassword);
                        return Ok(new { 
                            message = "Password fixed successfully", 
                            email = user.Email,
                            userId = user.Id 
                        });
                    }
                }
                catch
                {
                    // Continue trying other variations
                }
            }
            
            return NotFound(new { message = "User not found with any email variation" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password fix");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost("fix-password-by-id")]
    public async Task<ActionResult> FixPasswordById([FromBody] object request)
    {
        try
        {
            var requestDict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(request.ToString());
            var userId = requestDict["userId"]?.ToString();
            var newPassword = requestDict["newPassword"]?.ToString();

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(newPassword))
            {
                return BadRequest(new { message = "userId and newPassword are required" });
            }

            await _authService.ResetPasswordDirectlyAsync(userId, newPassword);
            
            return Ok(new { 
                message = "Password fixed successfully", 
                userId = userId
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password fix by ID");
            return StatusCode(500, new { message = ex.Message });
        }
    }
}

public class AdminPasswordResetRequest
{
    public string Email { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}
