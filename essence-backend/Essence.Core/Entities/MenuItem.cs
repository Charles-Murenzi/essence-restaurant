namespace Essence.Core.Entities;

public class MenuItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int EstimatedPrepTimeMinutes { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string? DietaryTags { get; set; } // e.g., "spicy,vegetarian"

    public Category Category { get; set; } = null!;
}
