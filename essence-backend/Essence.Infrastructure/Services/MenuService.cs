using Essence.Application.DTOs;
using Essence.Application.Interfaces;
using Essence.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Essence.Infrastructure.Services;

public class MenuService : IMenuService
{
    private readonly EssenceDbContext _context;

    public MenuService(EssenceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoryDto>> GetMenuAsync()
    {
        return await _context.Categories
            .Include(c => c.MenuItems)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                MenuItems = c.MenuItems.Select(m => new MenuItemDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price,
                    ImageUrl = m.ImageUrl,
                    EstimatedPrepTimeMinutes = m.EstimatedPrepTimeMinutes,
                    IsAvailable = m.IsAvailable,
                    DietaryTags = m.DietaryTags != null ? m.DietaryTags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>()
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<CategoryDto?> GetCategoryAsync(Guid id)
    {
        return await _context.Categories
            .Where(c => c.Id == id)
            .Include(c => c.MenuItems)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                MenuItems = c.MenuItems.Select(m => new MenuItemDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price,
                    ImageUrl = m.ImageUrl,
                    EstimatedPrepTimeMinutes = m.EstimatedPrepTimeMinutes,
                    IsAvailable = m.IsAvailable,
                    DietaryTags = m.DietaryTags != null ? m.DietaryTags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>()
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<MenuItemDto?> GetMenuItemAsync(Guid id)
    {
        return await _context.MenuItems
            .Where(m => m.Id == id)
            .Select(m => new MenuItemDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Price = m.Price,
                ImageUrl = m.ImageUrl,
                EstimatedPrepTimeMinutes = m.EstimatedPrepTimeMinutes,
                IsAvailable = m.IsAvailable,
                DietaryTags = m.DietaryTags != null ? m.DietaryTags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>()
            })
            .FirstOrDefaultAsync();
    }
}
