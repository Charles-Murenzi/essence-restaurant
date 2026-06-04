using Essence.Application.DTOs;
using Essence.Core.Enums;

namespace Essence.Application.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> PlaceOrderAsync(CreateOrderDto orderDto);
    Task<OrderResponseDto?> GetOrderAsync(Guid id);
    Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus status);
}
