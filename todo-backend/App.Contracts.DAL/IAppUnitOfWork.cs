using App.Contracts.DAL.Repositories;
using Base.Contracts.DAL;

namespace App.Contracts.DAL;

public interface IAppUnitOfWork : IUnitOfWork
{
    // List of repositories
    
    IToDoTaskRepository ToDoTasks { get; }
    
    // Custom DAL method definitions which use multiple DbSets
}