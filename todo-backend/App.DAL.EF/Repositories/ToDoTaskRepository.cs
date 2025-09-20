using App.Contracts.DAL.Repositories;
using App.Domain;
using Base.DAL.EF;
using Microsoft.EntityFrameworkCore;

namespace App.DAL.EF.Repositories;

public class ToDoTaskRepository : BaseEntityRepository<ToDoTask, AppDbContext>, IToDoTaskRepository
{
    public ToDoTaskRepository(AppDbContext dbContext) : base(dbContext)
    {
    }

    public ToDoTask CompleteTask(ToDoTask task, DateTime? completedAt)
    {
        task.CompletedAt = completedAt ?? DateTime.Now;
        return Update(task);
    }
    

    public ToDoTask UnCompleteTask(ToDoTask task)
    {
        task.CompletedAt = null;
        return Update(task);
    }
}