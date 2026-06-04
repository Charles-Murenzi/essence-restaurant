using Essence.Application.DTOs;

namespace Essence.Application.Interfaces;

public interface IMenuService
{
    Task<IEnumerable<CategoryDto>> GetMenuAsync();
    Task<CategoryDto?> GetCategoryAsync(Guid id);
    Task<MenuItemDto?> GetMenuItemAsync(Guid id);
}
