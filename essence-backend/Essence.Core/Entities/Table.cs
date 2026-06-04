namespace Essence.Core.Entities;

public class Table
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TableNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public bool IsOccupied { get; set; } = false;
    public string? QrCodeData { get; set; }
}
