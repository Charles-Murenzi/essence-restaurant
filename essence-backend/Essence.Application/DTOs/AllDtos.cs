using Essence.Core.Enums;

namespace Essence.Application.DTOs;

public class TableDto
{
    public Guid Id { get; set; }
    public string TableNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public bool IsOccupied { get; set; }
}

public class FeedbackRequestDto
{
    public string Message { get; set; } = string.Empty;
    public string? Category { get; set; }
}

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public List<MenuItemDto> MenuItems { get; set; } = new();
}

public class MenuItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int EstimatedPrepTimeMinutes { get; set; }
    public bool IsAvailable { get; set; }
    public List<string> DietaryTags { get; set; } = new();
}

public class StaffDto
{
    public Guid Id { get; set; }       // StaffProfile.Id
    public Guid UserId { get; set; }   // User.Id — used for WaiterId in orders
    public string FullName { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Gender { get; set; }
    public List<string> Languages { get; set; } = new();
    public List<string> Specialties { get; set; } = new();
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public int CurrentWorkload { get; set; }
}

public class CreateOrderDto
{
    public Guid TableId { get; set; }
    public Guid? WaiterId { get; set; }
    public List<OrderItemRequestDto> Items { get; set; } = new();
    public string? SpecialInstructions { get; set; }
    public PaymentMethod PreferredPaymentMethod { get; set; }
    public string? CustomerPhone { get; set; }
}

public class OrderItemRequestDto
{
    public Guid MenuItemId { get; set; }
    public int Quantity { get; set; }
    public string? Note { get; set; }
}

public class OrderResponseDto
{
    public Guid Id { get; set; }
    public string TableNumber { get; set; } = string.Empty;
    public string? WaiterName { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime OrderTime { get; set; }
    public int EstimatedReadyInMinutes { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class PaymentRequestDto
{
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
}

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public DateTime PaymentTime { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class RatingRequestDto
{
    public Guid OrderId { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
}

public class RatingDto
{
    public int Score { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
