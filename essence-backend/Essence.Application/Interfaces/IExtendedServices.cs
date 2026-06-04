using Essence.Application.DTOs;

namespace Essence.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentDto> ProcessPaymentAsync(PaymentRequestDto paymentRequest);
    Task<IEnumerable<PaymentDto>> GetPaymentHistoryAsync();
}

public interface IRatingService
{
    Task SubmitRatingAsync(RatingRequestDto ratingRequest);
    Task<IEnumerable<RatingDto>> GetStaffRatingsAsync(Guid staffId);
}
