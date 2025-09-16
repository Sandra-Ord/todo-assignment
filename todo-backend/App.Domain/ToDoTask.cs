using Base.Domain;

namespace App.Domain;

public class ToDoTask : BaseEntityId
{
    public string TaskName { get; set; } = default!;

    public DateTime CreatedAt { get; set; }

    public DateTime DueAt { get; set; }

    public DateTime? CompletedAt { get; set; }
}