using Essence.Core.Entities;
using Essence.Core.Enums;
using Essence.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Essence.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(EssenceDbContext context)
    {
        if (await context.Categories.AnyAsync()) return;

        // Categories
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new() { Name = "Brochettes", Description = "Traditional Rwandan grilled skewers", DisplayOrder = 1 },
                new() { Name = "Grilled Meat", Description = "Premium cuts grilled to perfection", DisplayOrder = 2 },
                new() { Name = "Burgers", Description = "Gourmet burgers with local twist", DisplayOrder = 3 },
                new() { Name = "Pizza", Description = "Stone-baked artisanal pizzas", DisplayOrder = 4 },
                new() { Name = "Drinks", Description = "Refreshing beverages", DisplayOrder = 5 },
                new() { Name = "Cocktails", Description = "Essence signature mixes", DisplayOrder = 6 }
            };
            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        // Menu Items
        if (!await context.MenuItems.AnyAsync())
        {
            var categories = await context.Categories.ToListAsync();
            var brochettesCat = categories.First(c => c.Name == "Brochettes");
            var meatCat = categories.First(c => c.Name == "Grilled Meat");

            var menuItems = new List<MenuItem>
            {
                new() { 
                    CategoryId = brochettesCat.Id, 
                    Name = "Goat Brochette", 
                    Description = "Tender goat meat skewers served with onion and pili-pili", 
                    Price = 1500, 
                    EstimatedPrepTimeMinutes = 15 
                },
                new() { 
                    CategoryId = brochettesCat.Id, 
                    Name = "Beef Brochette", 
                    Description = "Juicy beef cubes grilled with local spices", 
                    Price = 1200, 
                    EstimatedPrepTimeMinutes = 15 
                },
                new() { 
                    CategoryId = meatCat.Id, 
                    Name = "Whole Grilled Tilapia", 
                    Description = "Fresh Kivu Tilapia grilled with garlic and lemon", 
                    Price = 12000, 
                    EstimatedPrepTimeMinutes = 30 
                },
                new() { 
                    CategoryId = meatCat.Id, 
                    Name = "Essence Ribs", 
                    Description = "Slow-cooked pork ribs with honey glaze", 
                    Price = 8500, 
                    EstimatedPrepTimeMinutes = 25 
                }
            };
            await context.MenuItems.AddRangeAsync(menuItems);
        }

        // Staff
        if (!await context.Users.AnyAsync(u => u.Username == "ange"))
        {
            var staffUsers = new List<User>
            {
                new() { 
                    Username = "ange", 
                    FullName = "Ange Mutoni", 
                    Email = "ange@essence.rw", 
                    Role = UserRole.Waiter,
                    StaffProfile = new StaffProfile { 
                        LanguagesSpoken = "Kinyarwanda, English, French", 
                        Specialties = "Cocktails, Customer Care",
                        Gender = "Female",
                        AverageRating = 4.8,
                        ReviewCount = 124,
                        CurrentStatus = ShiftStatus.OnDuty
                    }
                },
                new() { 
                    Username = "eric", 
                    FullName = "Eric Ganza", 
                    Email = "eric@essence.rw", 
                    Role = UserRole.Waiter,
                    StaffProfile = new StaffProfile { 
                        LanguagesSpoken = "Kinyarwanda, English", 
                        Specialties = "Wine Service, Fast Service",
                        Gender = "Male",
                        AverageRating = 4.5,
                        ReviewCount = 98,
                        CurrentStatus = ShiftStatus.OnDuty
                    }
                }
            };
            await context.Users.AddRangeAsync(staffUsers);
        }
        
        // Tables
        if (!await context.Tables.AnyAsync())
        {
            var tables = new List<Table>
            {
                new() { TableNumber = "T1", Capacity = 2 },
                new() { TableNumber = "T2", Capacity = 4 },
                new() { TableNumber = "T3", Capacity = 4 },
                new() { TableNumber = "VIP 1", Capacity = 6 }
            };
            await context.Tables.AddRangeAsync(tables);
        }

        await context.SaveChangesAsync();
    }
}
