using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Contracts.DAL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using App.DAL.EF;
using App.Domain;
using App.DTO;

namespace WebApp.ApiControllers;

[Route("api/[controller]")]
[ApiController]
public class ToDoTaskController : ControllerBase
{
    private readonly IAppUnitOfWork _uow;

    public ToDoTaskController(IAppUnitOfWork uow)
    {
        _uow = uow;
    }

    // GET: api/ToDoTask
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ToDoTask>>> GetToDoTasks()
    {
        return Ok(await _uow.ToDoTasks.GetTasks());
    }

    // GET: api/ToDoTask/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ToDoTask>> GetToDoTask(int id)
    {
        var toDoTask = await _uow.ToDoTasks.FirstOrDefaultAsync(id);
        if (toDoTask == null)
        {
            return NotFound();
        }

        return toDoTask;
    }

    // PUT: api/ToDoTask/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutToDoTask(int id, ToDoTask toDoTask)
    {
        if (id != toDoTask.Id)
        {
            return BadRequest();
        }

        ToDoTask updatedTask;
        try
        {
            updatedTask = _uow.ToDoTasks.UpdateTaskInfo(toDoTask);
            await _uow.SaveChangesAsync();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_uow.ToDoTasks.Exists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return Ok(updatedTask);
    }

    // POST: api/ToDoTask/{id}/complete
    [HttpPost("{id}/complete")]
    public async Task<ActionResult<ToDoTask>> CompleteToDoTask(int id, DateTime? completedAt)
    {
        ToDoTask completedTask;
        try
        {
            completedTask = _uow.ToDoTasks.CompleteTask(id, completedAt);
            await _uow.SaveChangesAsync();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_uow.ToDoTasks.Exists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return Ok(completedTask);
    }

    // POST: api/ToDoTask/{id}/uncomplete
    [HttpPost("{id}/uncomplete")]
    public async Task<ActionResult<ToDoTask>> UncompleteToDoTask(int id)
    {
        ToDoTask uncompletedTask;
        try
        {
            uncompletedTask = _uow.ToDoTasks.UnCompleteTask(id);
            await _uow.SaveChangesAsync();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_uow.ToDoTasks.Exists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return Ok(uncompletedTask);
    }

    // POST: api/ToDoTask
    [HttpPost]
    public async Task<ActionResult<ToDoTask>> PostToDoTask(ToDoTask toDoTask)
    {
        _uow.ToDoTasks.Add(toDoTask);
        await _uow.SaveChangesAsync();

        return CreatedAtAction("GetToDoTask", new { id = toDoTask.Id }, toDoTask);
    }

    // DELETE: api/ToDoTask/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteToDoTask(int id)
    {
        var toDoTask = await _uow.ToDoTasks.FirstOrDefaultAsync(id);
        if (toDoTask == null)
        {
            return NotFound();
        }

        _uow.ToDoTasks.Remove(toDoTask);
        await _uow.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/filter
    [HttpGet("filter")]
    public async Task<ActionResult<IEnumerable<ToDoTask>>> GetFilteredTasksAsync([FromQuery] TaskFilter filter)
    {
        var tasks = await _uow.ToDoTasks.GetFilteredTasksAsync(filter);
        return Ok(tasks);
    }
}