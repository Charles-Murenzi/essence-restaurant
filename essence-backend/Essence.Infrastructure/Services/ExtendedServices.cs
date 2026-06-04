using Essence.Application.DTOs;
using Essence.Application.Interfaces;
using Essence.Core.Entities;
using Essence.Core.Enums;
using Essence.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Essence.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly EssenceDbContext _context;

    public PaymentService(EssenceDbContext context)
    {
        _context = context;
    }

    public async Task<PaymentDto> ProcessPaymentAsync(PaymentRequestDto paymentRequest)
    {
        var order = await _context.Orders.FindAsync(paymentRequest.OrderId);
        if (order == null) throw new Exception("Order not found");

        var payment = new Payment
        {
            OrderId = paymentRequest.OrderId,
            Amount = paymentRequest.Amount,
            Method = Enum.Parse<PaymentMethod>(paymentRequest.Method),
            PaymentTime = DateTime.UtcNow,
            Status = "Completed"
        };

        _context.Payments.Add(payment);
        
        // Mark order as completed if fully paid
        order.Status = OrderStatus.Completed;
        
        await _context.SaveChangesAsync();

        return new PaymentDto
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            Amount = payment.Amount,
            Method = payment.Method.ToString(),
            PaymentTime = payment.PaymentTime,
            Status = payment.Status
        };
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentHistoryAsync()
    {
        return await _context.Payments
            .OrderByDescending(p => p.PaymentTime)
            .Select(p => new PaymentDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                Amount = p.Amount,
                Method = p.Method.ToString(),
                PaymentTime = p.PaymentTime,
                Status = p.Status
            })
            .ToListAsync();
    }
}

public class RatingService : IRatingService
{
    private readonly EssenceDbContext _context;

    public RatingService(EssenceDbContext context)
    {
        _context = context;
    }

    public async Task SubmitRatingAsync(RatingRequestDto ratingRequest)
    {
        var order = await _context.Orders
            .Include(o => o.Waiter)
            .FirstOrDefaultAsync(o => o.Id == ratingRequest.OrderId);

        if (order == null || order.WaiterId == null) throw new Exception("Order or waiter not found");

        var rating = new Rating
        {
            OrderId = ratingRequest.OrderId,
            WaiterId = order.WaiterId.Value,
            Score = ratingRequest.Score,
            Comment = ratingRequest.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Ratings.Add(rating);

        // Update Waiter's average rating
        var waiterProfile = await _context.StaffProfiles.FirstOrDefaultAsync(s => s.UserId == order.WaiterId);
        if (waiterProfile != null)
        {
            var allRatings = await _context.Ratings.Where(r => r.WaiterId == order.WaiterId).ToListAsync();
            allRatings.Add(rating);
            waiterProfile.AverageRating = allRatings.Average(r => r.Score);
            waiterProfile.ReviewCount = allRatings.Count;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<RatingDto>> GetStaffRatingsAsync(Guid staffId)
    {
        return await _context.Ratings
            .Where(r => r.WaiterId == staffId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RatingDto
            {
                Score = r.Score,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }
}
