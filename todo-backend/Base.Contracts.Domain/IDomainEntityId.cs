namespace Base.Contracts.Domain;

public interface IDomainEntityId : IDomainEntityId<int>
{
}

public interface IDomainEntityId<TKey> 
    where TKey : IEquatable<TKey>
{
    public TKey Id { get; set; }
}