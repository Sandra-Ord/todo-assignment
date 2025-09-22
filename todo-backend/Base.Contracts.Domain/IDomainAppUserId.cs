namespace Base.Contracts.Domain;

public interface IDomainAppUserId : IDomainAppUserId<int>
{
}

public interface IDomainAppUserId<TKey>
    where TKey : IEquatable<TKey>
{
    public TKey AppUserId { get; set; }
}