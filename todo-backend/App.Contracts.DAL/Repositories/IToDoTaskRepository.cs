using App.Domain;
using Base.Contracts.DAL;

namespace App.Contracts.DAL.Repositories;

public interface IToDoTaskRepository : IEntityRepository<ToDoTask>
{
    // Custom DAL method definitions
    
    ToDoTask CompleteTask(ToDoTask task, DateTime? completedAt);
    
    ToDoTask UnCompleteTask(ToDoTask task);
}