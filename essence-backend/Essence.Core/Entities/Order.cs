using Essence.Core.Enums;

namespace Essence.Core.Entities;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TableId { get; set; }
    public Guid? WaiterId { get; set; } // Selected waiter
    public Guid? CustomerId { get; set; } // If logged in
    public DateTime OrderTime { get; set; } = DateTime.UtcNow;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; set; }
    public string? SpecialInstructions { get; set; }
    public PaymentMethod? PreferredPaymentMethod { get; set; }
    public string? CustomerPhone { get; set; }
    public int EstimatedReadyInMinutes { get; set; }

    public Table Table { get; set; } = null!;
    public User? Waiter { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
