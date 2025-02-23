using CoffeeCRM.Core;
using CoffeeCRM.Core.Repository;
using CoffeeCRM.Core.Service;
using CoffeeCRM.Data.Model;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add services to the container.
builder.Services.AddDbContext<SysDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection")));

builder.Services.AddControllers();
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

builder.Services.AddControllers();
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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
