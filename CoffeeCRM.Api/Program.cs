using CoffeeCRM.Core;
using CoffeeCRM.Core.Repository;
using CoffeeCRM.Core.Service;
using CoffeeCRM.Data.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add services to the container.
builder.Services.AddDbContext<SysDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection")));

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()       // Ghi log ra Console
    .CreateLogger();

builder.Host.UseSerilog();

// Cấu hình CORS (nếu cần)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", b => b.WithOrigins("*").AllowAnyMethod().AllowAnyHeader());
});

var jwtSection = builder.Configuration.GetSection("Jwt");

// Cấu hình dịch vụ xác thực JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],   // Địa chỉ issuer trong appSettings
            ValidAudience = jwtSection["Audience"], // Địa chỉ audience trong appSettings
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSection["Key"])), // Khóa bí mật
            ClockSkew = TimeSpan.Zero // Đặt ClockSkew = 0 để giảm độ trễ khi kiểm tra token
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
        );
    });



builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


// Add dependency injection for repositories and services
try
{
    builder.Services.Scan(scan => scan
    .FromAssembliesOf(typeof(IScoped))
        .AddClasses(classes => classes.AssignableTo<IScoped>())
            .AsImplementedInterfaces()
            .WithScopedLifetime());
}
catch (Exception ex)
{
    if (ex is System.Reflection.ReflectionTypeLoadException)
    {
        var typeLoadException = ex as ReflectionTypeLoadException;
        var loaderExceptions = typeLoadException.LoaderExceptions;
    }
}
#region add scoped
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
        builder.Services.AddScoped<IAccountService, AccountService>();
    
        builder.Services.AddScoped<IAccountActivityRepository, AccountActivityRepository>();
        builder.Services.AddScoped<IAccountActivityService, AccountActivityService>();
    
        builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();
        builder.Services.AddScoped<IAttendanceService, AttendanceService>();
    
        builder.Services.AddScoped<ICashFlowRepository, CashFlowRepository>();
        builder.Services.AddScoped<ICashFlowService, CashFlowService>();
    
        builder.Services.AddScoped<IDebtRepository, DebtRepository>();
        builder.Services.AddScoped<IDebtService, DebtService>();
    
        builder.Services.AddScoped<IDishRepository, DishRepository>();
        builder.Services.AddScoped<IDishService, DishService>();
    
        builder.Services.AddScoped<IDishCategoryRepository, DishCategoryRepository>();
        builder.Services.AddScoped<IDishCategoryService, DishCategoryService>();
    
        builder.Services.AddScoped<IDishOrderRepository, DishOrderRepository>();
        builder.Services.AddScoped<IDishOrderService, DishOrderService>();
    
        builder.Services.AddScoped<IDishOrderDetailRepository, DishOrderDetailRepository>();
        builder.Services.AddScoped<IDishOrderDetailService, DishOrderDetailService>();
    
        builder.Services.AddScoped<IDishOrderStatusRepository, DishOrderStatusRepository>();
        builder.Services.AddScoped<IDishOrderStatusService, DishOrderStatusService>();
    
        builder.Services.AddScoped<IFinancialTargetRepository, FinancialTargetRepository>();
        builder.Services.AddScoped<IFinancialTargetService, FinancialTargetService>();
    
        builder.Services.AddScoped<IIngredientRepository, IngredientRepository>();
        builder.Services.AddScoped<IIngredientService, IngredientService>();
    
        builder.Services.AddScoped<IIngredientCategoryRepository, IngredientCategoryRepository>();
        builder.Services.AddScoped<IIngredientCategoryService, IngredientCategoryService>();
    
        builder.Services.AddScoped<IInventoryAuditRepository, InventoryAuditRepository>();
        builder.Services.AddScoped<IInventoryAuditService, InventoryAuditService>();
    
        builder.Services.AddScoped<IInventoryDiscrepancyRepository, InventoryDiscrepancyRepository>();
        builder.Services.AddScoped<IInventoryDiscrepancyService, InventoryDiscrepancyService>();
    
        builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
        builder.Services.AddScoped<IInvoiceService, InvoiceService>();
    
        builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
        builder.Services.AddScoped<INotificationService, NotificationService>();
    
        builder.Services.AddScoped<INotificationStatusRepository, NotificationStatusRepository>();
        builder.Services.AddScoped<INotificationStatusService, NotificationStatusService>();
    
        builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
        builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
    
        builder.Services.AddScoped<IPurchaseOrderDetailRepository, PurchaseOrderDetailRepository>();
        builder.Services.AddScoped<IPurchaseOrderDetailService, PurchaseOrderDetailService>();
    
        builder.Services.AddScoped<IRoleRepository, RoleRepository>();
        builder.Services.AddScoped<IRoleService, RoleService>();
    
        builder.Services.AddScoped<IStockLevelRepository, StockLevelRepository>();
        builder.Services.AddScoped<IStockLevelService, StockLevelService>();
    
        builder.Services.AddScoped<IStockTransactionRepository, StockTransactionRepository>();
        builder.Services.AddScoped<IStockTransactionService, StockTransactionService>();
    
        builder.Services.AddScoped<IStockTransactionDetailRepository, StockTransactionDetailRepository>();
        builder.Services.AddScoped<IStockTransactionDetailService, StockTransactionDetailService>();
    
        builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
        builder.Services.AddScoped<ISupplierService, SupplierService>();
    
        builder.Services.AddScoped<ITableRepository, TableRepository>();
        builder.Services.AddScoped<ITableService, TableService>();
    
        builder.Services.AddScoped<ITableBookingRepository, TableBookingRepository>();
        builder.Services.AddScoped<ITableBookingService, TableBookingService>();
    
        builder.Services.AddScoped<IUnitRepository, UnitRepository>();
        builder.Services.AddScoped<IUnitService, UnitService>();
    
        builder.Services.AddScoped<IWarehouseRepository, WarehouseRepository>();
        builder.Services.AddScoped<IWarehouseService, WarehouseService>();

        builder.Services.AddScoped<ITokenService, TokenService>();
#endregion
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", b =>
        b.WithOrigins("https://localhost:7125", "http://127.0.0.1:5500") // domain frontend
         .AllowAnyMethod()
         .AllowAnyHeader()
         .AllowCredentials()); // BẮT BUỘC PHẢI THÊM DÒNG NÀY
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

if (!Directory.Exists(wwwrootPath))
{
    Directory.CreateDirectory(wwwrootPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(wwwrootPath),
    RequestPath = ""
});
    
app.UseRouting();
app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<NotificationHub>("/notificationHub");
});

app.Run();
