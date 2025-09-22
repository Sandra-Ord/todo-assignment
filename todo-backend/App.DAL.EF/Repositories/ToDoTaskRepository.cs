using App.Contracts.DAL.Repositories;
using App.Domain;
using App.DTO;
using Base.DAL.EF;
using Microsoft.EntityFrameworkCore;

namespace App.DAL.EF.Repositories;

public class ToDoTaskRepository : BaseEntityRepository<ToDoTask, AppDbContext>, IToDoTaskRepository
{
    public ToDoTaskRepository(AppDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IEnumerable<ToDoTask>> GetTasks()
    {
        return await RepoDbSet.OrderBy(t => t.DueAt).ToListAsync();
    }

    public ToDoTask CompleteTask(int id, DateTime? completedAt)
    {
        var taskEntity = RepoDbSet.FirstOrDefault(e => e.Id == id);
        if (taskEntity == null) throw new KeyNotFoundException("Task not found");

        taskEntity.CompletedAt = completedAt ?? DateTime.Now;
        return taskEntity;
    }
    

    public ToDoTask UnCompleteTask(int id)
    {
        var taskEntity = RepoDbSet.FirstOrDefault(e => e.Id == id);
        if (taskEntity == null) throw new KeyNotFoundException("Task not found");

        taskEntity.CompletedAt = null;
        return taskEntity;
    }

    public ToDoTask UpdateTaskInfo(ToDoTask task)
    {
        var taskEntity = RepoDbSet.FirstOrDefault(e => e.Id == task.Id);
        if (taskEntity == null) throw new KeyNotFoundException("Task not found");

        taskEntity.TaskName = task.TaskName;
        taskEntity.DueAt = task.DueAt;
        return taskEntity;  
    }

    public async Task<List<ToDoTask>> GetFilteredTasksAsync(TaskFilter filter)
    {
        var query = RepoDbSet.AsNoTracking();

        if (filter.Completed.HasValue)
        {
            query = query.Where(t => filter.Completed.Value ? t.CompletedAt != null : t.CompletedAt == null);
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            query = query.Where(t => t.TaskName.Contains(filter.Search));
        }

        if (filter.DueDateFrom.HasValue)
        {
            query = query.Where(t => t.DueAt >= filter.DueDateFrom.Value);
        }

        if (filter.DueDateUntil.HasValue)
        {
            query =  query.Where(t => t.DueAt <= filter.DueDateUntil.Value);
        }
        
        return await query.ToListAsync();
    }
}