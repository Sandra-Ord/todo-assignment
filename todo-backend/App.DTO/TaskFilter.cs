namespace App.DTO;

public class TaskFilter
{
    public bool? Completed { get; set; }
    public string? Search { get; set; }
    
    public DateTime? DueDateFrom { get; set; }
    public DateTime? DueDateUntil { get; set; }
    
}