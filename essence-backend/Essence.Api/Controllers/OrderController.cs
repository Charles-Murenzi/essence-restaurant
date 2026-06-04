using Essence.Application.DTOs;
using Essence.Application.Interfaces;
using Essence.Core.Enums;
using Essence.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Essence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly EssenceDbContext _context;

    public OrderController(IOrderService orderService, EssenceDbContext context)
    {
        _orderService = orderService;
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromBody] CreateOrderDto orderDto)
    {
        try
        {
            var response = await _orderService.PlaceOrderAsync(orderDto);
            return CreatedAtAction(nameof(GetOrder), new { id = response.Id }, response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var order = await _orderService.GetOrderAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] OrderStatus status)
    {
        var success = await _orderService.UpdateOrderStatusAsync(id, status);
        if (!success) return NotFound();
        return NoContent();
    }

    // Waiter confirms order and sets estimated time
    [HttpPatch("{id}/confirm")]
    public async Task<IActionResult> ConfirmOrder(Guid id, [FromBody] ConfirmOrderDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();
        order.Status = OrderStatus.Accepted;
        order.EstimatedReadyInMinutes = dto.EstimatedMinutes;
        await _context.SaveChangesAsync();
        return Ok(new { estimatedMinutes = dto.EstimatedMinutes });
    }

    // Get all active orders for a waiter
    [HttpGet("waiter/{waiterId}")]
    public async Task<IActionResult> GetWaiterOrders(Guid waiterId)
    {
        var orders = await _context.Orders
            .Include(o => o.Table)
            .Include(o => o.Items).ThenInclude(i => i.MenuItem)
            .Where(o => o.WaiterId == waiterId && o.Status != OrderStatus.Completed && o.Status != OrderStatus.Cancelled)
            .OrderByDescending(o => o.OrderTime)
            .ToListAsync();

        var result = orders.Select(o => new OrderResponseDto
        {
            Id = o.Id,
            TableNumber = o.Table.TableNumber,
            TotalAmount = o.TotalAmount,
            Status = o.Status.ToString(),
            OrderTime = o.OrderTime,
            EstimatedReadyInMinutes = o.EstimatedReadyInMinutes,
            Items = o.Items.Select(i => new OrderItemDto { Id = i.Id, Name = i.MenuItem.Name, Price = i.UnitPrice, Quantity = i.Quantity }).ToList()
        });

        return Ok(result);
    }

    // Get all pending orders (for waiter to pick up new ones)
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Table)
            .Include(o => o.Items).ThenInclude(i => i.MenuItem)
            .Where(o => o.Status == OrderStatus.Pending)
            .OrderBy(o => o.OrderTime)
            .ToListAsync();

        var result = orders.Select(o => new OrderResponseDto
        {
            Id = o.Id,
            TableNumber = o.Table.TableNumber,
            TotalAmount = o.TotalAmount,
            Status = o.Status.ToString(),
            OrderTime = o.OrderTime,
            EstimatedReadyInMinutes = o.EstimatedReadyInMinutes,
            Items = o.Items.Select(i => new OrderItemDto { Id = i.Id, Name = i.MenuItem.Name, Price = i.UnitPrice, Quantity = i.Quantity }).ToList()
        });

        return Ok(result);
    }
}

public class ConfirmOrderDto
{
    public int EstimatedMinutes { get; set; }
}
