using Essence.Application.DTOs;
using Essence.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Essence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost]
    public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequestDto request)
    {
        try
        {
            var response = await _paymentService.ProcessPaymentAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var history = await _paymentService.GetPaymentHistoryAsync();
        return Ok(history);
    }
}
