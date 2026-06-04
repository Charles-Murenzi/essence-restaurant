using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Add DbContext (SQL Server)
builder.Services.AddDbContext<Essence.Infrastructure.Persistence.EssenceDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000", "https://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Add SignalR
builder.Services.AddSignalR();

// Register Services
builder.Services.AddScoped<Essence.Application.Interfaces.IMenuService, Essence.Infrastructure.Services.MenuService>();
builder.Services.AddScoped<Essence.Application.Interfaces.IStaffService, Essence.Infrastructure.Services.StaffService>();
builder.Services.AddScoped<Essence.Application.Interfaces.IOrderService, Essence.Infrastructure.Services.OrderService>();
builder.Services.AddScoped<Essence.Application.Interfaces.IPaymentService, Essence.Infrastructure.Services.PaymentService>();
builder.Services.AddScoped<Essence.Application.Interfaces.IRatingService, Essence.Infrastructure.Services.RatingService>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Auto-migrate and seed on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<Essence.Infrastructure.Persistence.EssenceDbContext>();
        await context.Database.MigrateAsync();
        await Essence.Infrastructure.Persistence.DbInitializer.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database migration/seeding.");
    }
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
