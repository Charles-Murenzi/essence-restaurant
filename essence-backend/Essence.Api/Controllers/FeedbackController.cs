using Essence.Application.DTOs;
using Essence.Core.Entities;
using Essence.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace Essence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly EssenceDbContext _context;

    public FeedbackController(EssenceDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackRequestDto request)
    {
        var feedback = new Feedback
        {
            Message = request.Message,
            Category = request.Category,
            CreatedAt = DateTime.UtcNow
        };
        _context.Feedbacks.Add(feedback);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
