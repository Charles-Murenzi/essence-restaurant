using Essence.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Essence.Infrastructure.Persistence;

public class EssenceDbContext : DbContext
{
    public EssenceDbContext(DbContextOptions<EssenceDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<StaffProfile> StaffProfiles { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<MenuItem> MenuItems { get; set; } = null!;
    public DbSet<Table> Tables { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<Rating> Ratings { get; set; } = null!;
    public DbSet<Feedback> Feedbacks { get; set; } = null!;
    public DbSet<Reservation> Reservations { get; set; } = null!;
    public DbSet<InventoryItem> InventoryItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User - StaffProfile (One-to-One)
        modelBuilder.Entity<User>()
            .HasOne(u => u.StaffProfile)
            .WithOne(s => s.User)
            .HasForeignKey<StaffProfile>(s => s.UserId);

        // Category - MenuItem (One-to-Many)
        modelBuilder.Entity<Category>()
            .HasMany(c => c.MenuItems)
            .WithOne(m => m.Category)
            .HasForeignKey(m => m.CategoryId);

        // Order - OrderItem (One-to-Many)
        modelBuilder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId);

        // Order - Table (Many-to-One)
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Table)
            .WithMany()
            .HasForeignKey(o => o.TableId);

        // Order - Waiter (Many-to-One)
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Waiter)
            .WithMany()
            .HasForeignKey(o => o.WaiterId);

        // Precision for decimals
        modelBuilder.Entity<MenuItem>()
            .Property(m => m.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.UnitPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<InventoryItem>()
            .Property(i => i.UnitCost)
            .HasPrecision(18, 2);

        modelBuilder.Entity<InventoryItem>()
            .Property(i => i.StockQuantity)
            .HasPrecision(18, 2);

        modelBuilder.Entity<InventoryItem>()
            .Property(i => i.MinimumStockLevel)
            .HasPrecision(18, 2);
    }
}
