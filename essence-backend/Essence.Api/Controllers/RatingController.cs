using Essence.Application.DTOs;
using Essence.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Essence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitRating([FromBody] RatingRequestDto request)
    {
        try
        {
            await _ratingService.SubmitRatingAsync(request);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("staff/{staffId}")]
    public async Task<IActionResult> GetStaffRatings(Guid staffId)
    {
        var ratings = await _ratingService.GetStaffRatingsAsync(staffId);
        return Ok(ratings);
    }
}
