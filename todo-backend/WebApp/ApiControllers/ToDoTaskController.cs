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

namespace WebApp.ApiControllers
{
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
            return Ok(await _uow.ToDoTasks.GetAllAsync());
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

        // PUT: api/ToDoTask/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutToDoTask(int id, ToDoTask toDoTask)
        {
            if (id != toDoTask.Id)
            {
                return BadRequest();
            }
            
            _uow.ToDoTasks.Update(toDoTask);

            try
            {
                await _uow.SaveChangesAsync();
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

            return NoContent();
        }

        // POST: api/ToDoTask/{id}/complete
        [HttpPost("{id}/complete")]
        public async Task<ActionResult<ToDoTask>> CompleteToDoTask(int id, DateTime? completedAt)
        {
            var toDoTask = await _uow.ToDoTasks.FirstOrDefaultAsync(id);
            if (toDoTask == null)
            {
                return NotFound();
            }
            
            toDoTask.CompletedAt = completedAt ?? DateTime.Now;
            _uow.ToDoTasks.Update(toDoTask);
            await _uow.SaveChangesAsync();
            return Ok(toDoTask);
        }

        // POST: api/ToDoTask/{id}/uncomplete
        [HttpPost("{id}/uncomplete")]
        public async Task<ActionResult<ToDoTask>> UncompleteToDoTask(int id)
        {
            var toDoTask = await _uow.ToDoTasks.FirstOrDefaultAsync(id);
            if (toDoTask == null)
            {
                return NotFound();
            }
            toDoTask.CompletedAt = null;
            _uow.ToDoTasks.Update(toDoTask);
            await _uow.SaveChangesAsync();
            return Ok(toDoTask);
        }
        
        // POST: api/ToDoTask
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ToDoTask>> PostToDoTask(ToDoTask toDoTask)
        {
            _uow.ToDoTasks.Add(toDoTask);
            await _uow.SaveChangesAsync();

            return CreatedAtAction("GetToDoTask", new { id = toDoTask.Id }, toDoTask);
        }

        // DELETE: api/ToDoTask/5
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
    }
}
