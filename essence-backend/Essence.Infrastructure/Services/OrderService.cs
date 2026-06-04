using Essence.Application.DTOs;
using Essence.Application.Interfaces;
using Essence.Core.Entities;
using Essence.Core.Enums;
using Essence.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Essence.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly EssenceDbContext _context;

    public OrderService(EssenceDbContext context)
    {
        _context = context;
    }

    public async Task<OrderResponseDto> PlaceOrderAsync(CreateOrderDto orderDto)
    {
        var menuItems = await _context.MenuItems
            .Where(m => orderDto.Items.Select(i => i.MenuItemId).Contains(m.Id))
            .ToListAsync();

        var order = new Order
        {
            TableId = orderDto.TableId,
            WaiterId = orderDto.WaiterId,
            SpecialInstructions = orderDto.SpecialInstructions,
            PreferredPaymentMethod = orderDto.PreferredPaymentMethod,
            CustomerPhone = orderDto.CustomerPhone,
            Status = OrderStatus.Pending,
            OrderTime = DateTime.UtcNow,
            Items = orderDto.Items.Select(i => {
                var menuItem = menuItems.First(m => m.Id == i.MenuItemId);
                return new OrderItem
                {
                    MenuItemId = i.MenuItemId,
                    Quantity = i.Quantity,
                    UnitPrice = menuItem.Price,
                    Note = i.Note
                };
            }).ToList()
        };

        order.TotalAmount = order.Items.Sum(i => i.Quantity * i.UnitPrice);
        order.EstimatedReadyInMinutes = order.Items.Max(i => menuItems.First(m => m.Id == i.MenuItemId).EstimatedPrepTimeMinutes) + 5;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return await GetOrderAsync(order.Id) ?? throw new Exception("Order creation failed");
    }

    public async Task<OrderResponseDto?> GetOrderAsync(Guid id)
    {
        return await _context.Orders
            .Include(o => o.Table)
            .Include(o => o.Waiter)
            .Include(o => o.Items)
                .ThenInclude(i => i.MenuItem)
            .Where(o => o.Id == id)
            .Select(o => new OrderResponseDto
            {
                Id = o.Id,
                TableNumber = o.Table.TableNumber,
                WaiterName = o.Waiter != null ? o.Waiter.FullName : null,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                OrderTime = o.OrderTime,
                EstimatedReadyInMinutes = o.EstimatedReadyInMinutes,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    Name = i.MenuItem.Name,
                    Price = i.UnitPrice,
                    Quantity = i.Quantity
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus status)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null) return false;

        order.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }
}
