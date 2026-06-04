using Essence.Application.DTOs;
using Essence.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Essence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TablesController : ControllerBase
{
    private readonly EssenceDbContext _context;

    public TablesController(EssenceDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTables()
    {
        var tables = await _context.Tables
            .Select(t => new TableDto { Id = t.Id, TableNumber = t.TableNumber, Capacity = t.Capacity, IsOccupied = t.IsOccupied })
            .ToListAsync();
        return Ok(tables);
    }
}
