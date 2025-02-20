using CoffeeCRM.Core;
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
