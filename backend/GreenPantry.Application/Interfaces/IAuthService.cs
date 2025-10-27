using GreenPantry.Application.DTOs.Auth;

namespace GreenPantry.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task LogoutAsync(string userId);
    Task<bool> ValidateTokenAsync(string token);
    Task<string> GetUserIdFromTokenAsync(string token);
    Task RequestPasswordResetAsync(string email);
    Task<bool> ResetPasswordAsync(string userId, string token, string newPassword);
    Task ResetPasswordDirectlyAsync(string userId, string newPassword);
}
