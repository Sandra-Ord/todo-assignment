using App.Contracts.DAL;
using App.Contracts.DAL.Repositories;
using App.DAL.EF.Repositories;
using Base.DAL.EF;

namespace App.DAL.EF;

public class AppUnitOfWork : BaseUnitOfWork<AppDbContext>, IAppUnitOfWork
{
    public AppUnitOfWork(AppDbContext dbContext) : base(dbContext)
    {
    }

    // List of repositories
    
    private IToDoTaskRepository? _toDoTaskRepository;
    public IToDoTaskRepository ToDoTasks => _toDoTaskRepository ?? new ToDoTaskRepository(UowDbContext);
    
    // Custom DAL method implementations which use multiple DbSets
}