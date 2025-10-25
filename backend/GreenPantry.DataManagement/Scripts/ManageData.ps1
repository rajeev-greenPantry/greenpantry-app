# GreenPantry Data Management Script
# This script provides easy data management operations for the GreenPantry backend

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("seed-restaurants", "seed-menu-items", "seed-all", "update-restaurant", "update-menu-item", "bulk-update", "validate-data", "check-consistency")]
    [string]$Action,
    
    [string]$ApiBaseUrl = "https://localhost:7001",
    [string]$AuthToken = "",
    [string]$DataFile = "",
    [string]$RestaurantId = "",
    [string]$MenuItemId = ""
)

# Configuration
$Headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $AuthToken"
}

# Helper function to make API calls
function Invoke-ApiCall {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null
    )
    
    $Uri = "$ApiBaseUrl/api/DataManagement/$Endpoint"
    
    try {
        if ($Body) {
            $JsonBody = $Body | ConvertTo-Json -Depth 10
            $Response = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $Headers -Body $JsonBody
        } else {
            $Response = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $Headers
        }
        
        Write-Host "✅ Success: $($Response.message)" -ForegroundColor Green
        return $Response
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $ErrorResponse = $_.Exception.Response.GetResponseStream()
            $Reader = New-Object System.IO.StreamReader($ErrorResponse)
            $ErrorContent = $Reader.ReadToEnd()
            Write-Host "Details: $ErrorContent" -ForegroundColor Red
        }
        return $null
    }
}

# Helper function to load data from JSON file
function Load-DataFromFile {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ Error: File not found: $FilePath" -ForegroundColor Red
        return $null
    }
    
    try {
        $Content = Get-Content $FilePath -Raw
        $Data = $Content | ConvertFrom-Json
        Write-Host "✅ Loaded data from: $FilePath" -ForegroundColor Green
        return $Data
    }
    catch {
        Write-Host "❌ Error loading JSON file: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Main script logic
Write-Host "🍽️ GreenPantry Data Management Script" -ForegroundColor Cyan
Write-Host "Action: $Action" -ForegroundColor Yellow
Write-Host "API Base URL: $ApiBaseUrl" -ForegroundColor Yellow
Write-Host ""

switch ($Action) {
    "seed-restaurants" {
        Write-Host "🌱 Seeding restaurants..." -ForegroundColor Cyan
        Invoke-ApiCall -Method "POST" -Endpoint "seed/restaurants"
    }
    
    "seed-menu-items" {
        Write-Host "🍽️ Seeding menu items..." -ForegroundColor Cyan
        Invoke-ApiCall -Method "POST" -Endpoint "seed/menu-items"
    }
    
    "seed-all" {
        Write-Host "🌱 Seeding all data..." -ForegroundColor Cyan
        Invoke-ApiCall -Method "POST" -Endpoint "seed/all"
    }
    
    "update-restaurant" {
        if (-not $DataFile) {
            Write-Host "❌ Error: DataFile parameter is required for update-restaurant" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "🏪 Updating restaurant from file: $DataFile" -ForegroundColor Cyan
        $RestaurantData = Load-DataFromFile -FilePath $DataFile
        if ($RestaurantData) {
            Invoke-ApiCall -Method "POST" -Endpoint "restaurants" -Body $RestaurantData
        }
    }
    
    "update-menu-item" {
        if (-not $DataFile) {
            Write-Host "❌ Error: DataFile parameter is required for update-menu-item" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "🍽️ Updating menu item from file: $DataFile" -ForegroundColor Cyan
        $MenuItemData = Load-DataFromFile -FilePath $DataFile
        if ($MenuItemData) {
            Invoke-ApiCall -Method "POST" -Endpoint "menu-items" -Body $MenuItemData
        }
    }
    
    "bulk-update" {
        if (-not $DataFile) {
            Write-Host "❌ Error: DataFile parameter is required for bulk-update" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "📦 Bulk updating from file: $DataFile" -ForegroundColor Cyan
        $Data = Load-DataFromFile -FilePath $DataFile
        
        if ($Data) {
            # Determine if it's restaurants or menu items based on the data structure
            if ($Data[0].PSObject.Properties.Name -contains "cuisineTypes") {
                Write-Host "Detected restaurant data, performing bulk restaurant update..." -ForegroundColor Yellow
                Invoke-ApiCall -Method "POST" -Endpoint "restaurants/bulk" -Body $Data
            } elseif ($Data[0].PSObject.Properties.Name -contains "restaurantId") {
                Write-Host "Detected menu item data, performing bulk menu item update..." -ForegroundColor Yellow
                Invoke-ApiCall -Method "POST" -Endpoint "menu-items/bulk" -Body $Data
            } else {
                Write-Host "❌ Error: Unable to determine data type. Please ensure the JSON file contains either restaurant or menu item data." -ForegroundColor Red
            }
        }
    }
    
    "validate-data" {
        if (-not $DataFile) {
            Write-Host "❌ Error: DataFile parameter is required for validate-data" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "🔍 Validating data from file: $DataFile" -ForegroundColor Cyan
        $Data = Load-DataFromFile -FilePath $DataFile
        
        if ($Data) {
            # Determine data type and validate accordingly
            if ($Data.PSObject.Properties.Name -contains "cuisineTypes") {
                Write-Host "Validating restaurant data..." -ForegroundColor Yellow
                Invoke-ApiCall -Method "POST" -Endpoint "validate/restaurant" -Body $Data
            } elseif ($Data.PSObject.Properties.Name -contains "restaurantId") {
                Write-Host "Validating menu item data..." -ForegroundColor Yellow
                Invoke-ApiCall -Method "POST" -Endpoint "validate/menu-item" -Body $Data
            } else {
                Write-Host "❌ Error: Unable to determine data type for validation." -ForegroundColor Red
            }
        }
    }
    
    "check-consistency" {
        Write-Host "🔍 Checking data consistency..." -ForegroundColor Cyan
        # Note: This would require a custom endpoint for consistency checking
        Write-Host "⚠️ Consistency checking endpoint not implemented yet" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ Script completed!" -ForegroundColor Green
