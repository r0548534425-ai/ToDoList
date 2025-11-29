using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TodoApi;

var builder = WebApplication.CreateBuilder(args);

// Configure Services
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("ToDoDB"),
        new MySqlServerVersion(new Version(8, 0, 44))));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ToDo API", Version = "v1" });
});

var app = builder.Build();

// --- בדיקת חיבור למסד ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ToDoDbContext>();
    try
    {
        if (db.Database.CanConnect())
            Console.WriteLine("? Connected to Clever-Cloud MySQL");
        else
            Console.WriteLine("? Cannot connect to database");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"? Database connection failed: {ex.Message}");
    }
}

// Middleware
app.UseCors();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ToDo API V1");
    c.RoutePrefix = string.Empty;
});

// Routes (CRUD)
app.MapGet("/items", async (ToDoDbContext db) => await db.Items.ToListAsync());

app.MapGet("/items/{id}", async (ToDoDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    return item != null ? Results.Ok(item) : Results.NotFound();
});

app.MapPost("/items", async (ToDoDbContext db, Item item) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{item.Id}", item);
});

app.MapPut("/items/{id}", async (ToDoDbContext db, int id, Item inputItem) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    item.Name = string.IsNullOrEmpty(inputItem.Name) ? item.Name : inputItem.Name;
    item.IsComplete = inputItem.IsComplete;

    await db.SaveChangesAsync();
    return Results.Ok(item);
});

app.MapDelete("/items/{id}", async (ToDoDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.Ok();
});
app.MapGet("/", () => "API is running!!");
app.Run();
