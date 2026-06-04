using Essence.Core.Enums;

namespace Essence.Core.Entities;

public class StaffProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? Gender { get; set; }
    public string? LanguagesSpoken { get; set; } // Comma-separated or serialized
    public string? Specialties { get; set; }
    public double AverageRating { get; set; } = 0;
    public int ReviewCount { get; set; } = 0;
    public ShiftStatus CurrentStatus { get; set; } = ShiftStatus.OffDuty;
    public int CurrentWorkload { get; set; } = 0;

    // Navigation property
    public User User { get; set; } = null!;
}
