using Essence.Application.DTOs;
using Essence.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Essence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _menuService;

    public MenuController(IMenuService menuService)
    {
        _menuService = menuService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMenu()
    {
        var menu = await _menuService.GetMenuAsync();
        return Ok(menu);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategory(Guid id)
    {
        var category = await _menuService.GetCategoryAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpGet("items/{id}")]
    public async Task<IActionResult> GetMenuItem(Guid id)
    {
        var item = await _menuService.GetMenuItemAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }
}
