using App.Domain;
using App.DTO;
using Base.Contracts.DAL;

namespace App.Contracts.DAL.Repositories;

public interface IToDoTaskRepository : IEntityRepository<ToDoTask>
{
    // Custom DAL method definitions
    
    Task<IEnumerable<ToDoTask>> GetTasks();
    
    ToDoTask CompleteTask(int id, DateTime? completedAt);
    
    ToDoTask UnCompleteTask(int id);
    
    ToDoTask UpdateTaskInfo(ToDoTask task);
    
    Task<List<ToDoTask>> GetFilteredTasksAsync(TaskFilter filter);
}