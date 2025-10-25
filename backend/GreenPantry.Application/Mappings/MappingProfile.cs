using AutoMapper;
using GreenPantry.Application.DTOs.Auth;
using GreenPantry.Application.DTOs.Menu;
using GreenPantry.Application.DTOs.Order;
using GreenPantry.Application.DTOs.Restaurant;
using GreenPantry.Domain.Entities;
using System.Linq;

namespace GreenPantry.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        CreateMap<UserDto, User>();
        CreateMap<Address, GreenPantry.Application.DTOs.Auth.AddressDto>();
        CreateMap<GreenPantry.Application.DTOs.Auth.AddressDto, Address>();

        // Restaurant mappings
        CreateMap<Restaurant, RestaurantDto>()
            .ForMember(dest => dest.CuisineTypes, opt => opt.MapFrom(src => src.CuisineTypes.Select(ct => ct.ToString()).ToList()));
        CreateMap<Restaurant, RestaurantDetailDto>()
            .ForMember(dest => dest.CuisineTypes, opt => opt.MapFrom(src => src.CuisineTypes.Select(ct => ct.ToString()).ToList()));
        CreateMap<RestaurantDto, Restaurant>()
            .ForMember(dest => dest.CuisineTypes, opt => opt.MapFrom(src => src.CuisineTypes.Select(ct => ParseCuisineType(ct)).ToList()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ParseRestaurantStatus(src.Status)));
        CreateMap<RestaurantDetailDto, Restaurant>()
            .ForMember(dest => dest.CuisineTypes, opt => opt.MapFrom(src => src.CuisineTypes.Select(ct => ParseCuisineType(ct)).ToList()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ParseRestaurantStatus(src.Status)));

        // Menu item mappings
        CreateMap<MenuItem, MenuItemDto>();
        CreateMap<MenuItemDto, MenuItem>();
        CreateMap<MenuItemVariant, MenuItemVariantDto>();
        CreateMap<MenuItemVariantDto, MenuItemVariant>();

        // Order mappings
        CreateMap<Order, OrderDto>();
        CreateMap<OrderDto, Order>();
        CreateMap<OrderItem, OrderItemDto>();
        CreateMap<OrderItemDto, OrderItem>();
        CreateMap<OrderStatusHistory, OrderStatusHistoryDto>();
        CreateMap<OrderStatusHistoryDto, OrderStatusHistory>();
        CreateMap<CreateOrderItemRequest, OrderItem>();
        CreateMap<CreateOrderRequest, Order>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.OrderNumber, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.Items, opt => opt.Ignore())
            .ForMember(dest => dest.SubTotal, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveryFee, opt => opt.Ignore())
            .ForMember(dest => dest.Tax, opt => opt.Ignore())
            .ForMember(dest => dest.Total, opt => opt.Ignore())
            .ForMember(dest => dest.PaymentId, opt => opt.Ignore())
            .ForMember(dest => dest.EstimatedDeliveryTime, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveredAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveryPersonId, opt => opt.Ignore())
            .ForMember(dest => dest.StatusHistory, opt => opt.Ignore());
    }

    private static Domain.Enums.CuisineType ParseCuisineType(string cuisineType)
    {
        return Enum.TryParse<Domain.Enums.CuisineType>(cuisineType, true, out var result) ? result : Domain.Enums.CuisineType.Other;
    }

    private static Domain.Enums.RestaurantStatus ParseRestaurantStatus(string status)
    {
        return Enum.TryParse<Domain.Enums.RestaurantStatus>(status, true, out var result) ? result : Domain.Enums.RestaurantStatus.Pending;
    }
}
