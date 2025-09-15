using Microsoft.AspNetCore.Mvc;

namespace WebApp.Controllers;

[ApiController]
[Route("api/todo")]
public class ToDoController : ControllerBase
{
    public ToDoController()
    {
        
    }

    [HttpGet("Tasks")]
    public IActionResult GetTasks()
    {
        return Ok();
    }
}