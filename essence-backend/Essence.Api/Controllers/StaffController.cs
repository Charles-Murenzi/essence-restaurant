using Essence.Application.DTOs;
using Essence.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Essence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{
    private readonly IStaffService _staffService;

    public StaffController(IStaffService staffService)
    {
        _staffService = staffService;
    }

    [HttpGet("waiters")]
    public async Task<IActionResult> GetAvailableWaiters()
    {
        var waiters = await _staffService.GetAvailableWaitersAsync();
        return Ok(waiters);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStaffProfile(Guid id)
    {
        var profile = await _staffService.GetStaffProfileAsync(id);
        if (profile == null) return NotFound();
        return Ok(profile);
    }
}
