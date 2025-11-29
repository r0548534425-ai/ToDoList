using Microsoft.EntityFrameworkCore;

namespace TodoApi
{
    public class Item
    {
        
            public int Id { get; set; }
            public string? Name { get; set; }   // שים לב ל־? זה מאפשר ערך null
            public bool IsComplete { get; set; }
       

    }

    public class ToDoDbContext : DbContext
    {
        public ToDoDbContext(DbContextOptions<ToDoDbContext> options) : base(options) { }
        public DbSet<Item> Items { get; set; } = null!;
    }
}
