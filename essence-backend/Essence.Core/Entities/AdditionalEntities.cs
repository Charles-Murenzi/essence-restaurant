using Essence.Core.Enums;

namespace Essence.Core.Entities;

public class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public string? TransactionReference { get; set; }
    public DateTime PaymentTime { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Completed";

    public Order Order { get; set; } = null!;
}

public class Rating
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public Guid WaiterId { get; set; }
    public int Score { get; set; } // 1-5
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Order Order { get; set; } = null!;
    public User Waiter { get; set; } = null!;
}

public class Feedback
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? CustomerId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Category { get; set; } // Food, Service, Ambience
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? Customer { get; set; }
}

public class Reservation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public DateTime ReservationTime { get; set; }
    public int GuestCount { get; set; }
    public Guid? TableId { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Seated

    public Table? Table { get; set; }
}

public class InventoryItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty; // kg, liters, pcs
    public decimal StockQuantity { get; set; }
    public decimal MinimumStockLevel { get; set; }
    public decimal UnitCost { get; set; }
}
