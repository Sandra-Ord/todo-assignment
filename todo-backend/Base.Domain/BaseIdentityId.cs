using Base.Contracts.Domain;

namespace Base.Domain;

public abstract class BaseEntityId : BaseIdentityId<int>, IDomainEntityId
{
}

public abstract class BaseIdentityId<TKey> : IDomainEntityId<TKey> 
    where TKey : IEquatable<TKey>
{
    public TKey Id { get; set; } = default!;
}