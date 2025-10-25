# Use the official .NET 8 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY GreenPantry.API/GreenPantry.API.csproj GreenPantry.API/
COPY GreenPantry.Application/GreenPantry.Application.csproj GreenPantry.Application/
COPY GreenPantry.Domain/GreenPantry.Domain.csproj GreenPantry.Domain/
COPY GreenPantry.Infrastructure/GreenPantry.Infrastructure.csproj GreenPantry.Infrastructure/

# Restore dependencies
RUN dotnet restore GreenPantry.API/GreenPantry.API.csproj

# Copy all source code
COPY . .

# Build the application
WORKDIR /src/GreenPantry.API
RUN dotnet build "GreenPantry.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "GreenPantry.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official .NET 8 runtime image for running
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the published application
COPY --from=publish /app/publish .

# Expose port 80
EXPOSE 80
EXPOSE 443

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start the application
ENTRYPOINT ["dotnet", "GreenPantry.API.dll"]
