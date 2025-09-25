interface StatusBadgeProps {
    dueAt: string | Date;
    completedAt?: string | Date | null;
}

export default function StatusBadge({ dueAt, completedAt } : StatusBadgeProps) {
    let badgeText = "";
    let badgeClass = "";

    const dueDate = new Date(dueAt);

    if (completedAt) {
        badgeText = "Completed";
        badgeClass = "success";
    } else if (dueDate < new Date()) {
        badgeText = "Overdue";
        badgeClass = "danger";
    } else {
        badgeText = "Due soon";
        badgeClass = "warning";
    }

    return <span className={`badge ${badgeClass}`}>{badgeText}</span>;
};