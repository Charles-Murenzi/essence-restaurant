using Essence.Application.DTOs;

namespace Essence.Application.Interfaces;

public interface IStaffService
{
    Task<IEnumerable<StaffDto>> GetAvailableWaitersAsync();
    Task<StaffDto?> GetStaffProfileAsync(Guid id);
}
