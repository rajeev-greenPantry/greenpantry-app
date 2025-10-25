using GreenPantry.Application.DTOs.Auth;
using GreenPantry.Application.DTOs.Order;

namespace GreenPantry.Application.Interfaces;

public interface IUserService
{
    Task<UserDto?> GetUserByIdAsync(string id);
    Task<UserDto> UpdateUserProfileAsync(string id, UserDto user);
    Task<bool> UpdateUserAddressAsync(string id, GreenPantry.Application.DTOs.Auth.AddressDto address);
    Task<IEnumerable<OrderDto>> GetUserOrderHistoryAsync(string userId);
}
