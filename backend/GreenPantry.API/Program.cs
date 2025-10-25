using GreenPantry.API.Extensions;
using GreenPantry.API.Middleware;
using GreenPantry.Application.Extensions;
using GreenPantry.Infrastructure.Extensions;
using GreenPantry.Infrastructure.Data;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add application services
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add authentication
builder.Services.AddAuthentication(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

// Ensure Cosmos DB database and containers exist
using (var scope = app.Services.CreateScope())
{
    try
    {
        var cosmosContext = scope.ServiceProvider.GetRequiredService<CosmosDbContext>();
        await cosmosContext.EnsureContainersExistAsync();
        Log.Information("Cosmos DB database and containers initialized successfully");
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "Failed to initialize Cosmos DB database and containers - continuing without database initialization");
        // Don't throw - allow the API to start without database for development
    }
}

app.MapControllers();

// Add health check endpoint
app.MapGet("/health", () => new { Status = "Healthy", Timestamp = DateTime.UtcNow });

// Add database health check endpoint
app.MapGet("/health/database", async (HttpContext context) =>
{
    try
    {
        var cosmosContext = context.RequestServices.GetRequiredService<CosmosDbContext>();
        var exists = await cosmosContext.DatabaseExistsAsync();
        await context.Response.WriteAsJsonAsync(new { Status = "Healthy", DatabaseExists = exists, Timestamp = DateTime.UtcNow });
    }
    catch (Exception ex)
    {
        await context.Response.WriteAsJsonAsync(new { Status = "Unhealthy", Error = ex.Message, Timestamp = DateTime.UtcNow });
    }
});

app.Run();
