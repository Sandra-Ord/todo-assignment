using App.Domain;
using Microsoft.EntityFrameworkCore;

namespace App.DAL.EF;

public class AppDbContext : DbContext
{
    public DbSet<ToDoTask> ToDoTasks { get; set; } = default!;
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
}