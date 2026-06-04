using Essence.Application.DTOs;
using Essence.Application.Interfaces;
using Essence.Core.Entities;
using Essence.Core.Enums;
using Essence.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Essence.Infrastructure.Services;

public class StaffService : IStaffService
{
    private readonly EssenceDbContext _context;

    public StaffService(EssenceDbContext context)
    {
        _context = context;
    }

    private static StaffDto MapToDto(StaffProfile s) => new StaffDto
    {
        Id = s.Id,
        UserId = s.UserId,
        FullName = s.User.FullName,
        ProfilePictureUrl = s.ProfilePictureUrl,
        Gender = s.Gender,
        Languages = s.LanguagesSpoken != null ? s.LanguagesSpoken.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(l => l.Trim()).ToList() : new List<string>(),
        Specialties = s.Specialties != null ? s.Specialties.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(sp => sp.Trim()).ToList() : new List<string>(),
        Rating = s.AverageRating,
        ReviewCount = s.ReviewCount,
        Status = s.CurrentStatus.ToString(),
        CurrentWorkload = s.CurrentWorkload
    };

    public async Task<IEnumerable<StaffDto>> GetAvailableWaitersAsync()
    {
        var profiles = await _context.StaffProfiles
            .Include(s => s.User)
            .Where(s => s.User.Role == UserRole.Waiter && s.CurrentStatus == ShiftStatus.OnDuty)
            .ToListAsync();
        return profiles.Select(MapToDto);
    }

    public async Task<StaffDto?> GetStaffProfileAsync(Guid id)
    {
        var profile = await _context.StaffProfiles
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);
        return profile == null ? null : MapToDto(profile);
    }
}
