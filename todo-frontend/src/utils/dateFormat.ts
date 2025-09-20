export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function untilDueDate(dateString: string) {
    const now = new Date();
    const due = new Date(dateString);
    let difference = due - now;

    if (difference <= 0) {
        return "(overdue)";
    }

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months >= 2) {
        return `(in ${months} months)`;
    } else if (weeks >= 2) {
        return `(in ${weeks} weeks)`;
    } else if (days >= 2) {
        return `(in ${days} days)`;
    } else if (hours >= 24) {
        const inDays = Math.floor(hours / 24);
        const inHours = hours % 24;
        return `(in ${inDays} days ${inHours} hrs)`;
    } else if (hours >= 1) {
        const inHours = hours;
        const inMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        return `(in ${inHours} hrs ${inMinutes} mins)`;
    } else {
        return `(in ${minutes} mins)`;
    }
}