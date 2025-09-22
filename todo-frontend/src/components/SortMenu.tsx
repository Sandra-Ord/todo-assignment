import MaterialIcon from "@/components/common/MaterialIcon";
import MaterialIconLabel from "@/components/common/MaterialIconLabel";

interface SortMenuProps {
    sortBy: "dueAt" | "completedAt" | "createdAt";
    setSortBy: (value: "dueAt" | "completedAt" | "createdAt") => void;
    completedLast: boolean;
    setCompletedLast: (value: boolean) => void;
}

export default function SortMenu({sortBy, setSortBy, completedLast, setCompletedLast}: SortMenuProps) {
    return (
        <div className="btn-group">
            <div
                role="button"
                className="dropdown-toggle d-flex gap-2 align-items-center"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-auto-close="outside"
            >
                <MaterialIconLabel label="Sort by" name="sort" spanClassName="d-md-none d-lg-inline"/>
             </div>
            <ul className="dropdown-menu dropdown-menu-start">
                <li>
                    <button className="dropdown-item" type="button" onClick={() => setSortBy("dueAt")}>
                        Due Date
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" type="button" onClick={() => setSortBy("completedAt")}>
                        Completion Date
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" type="button" onClick={() => setSortBy("createdAt")}>
                        Creation Date
                    </button>
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>
                <li className="dropdown-item">
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="completedTasksLast"
                            checked={completedLast}
                            onChange={(e) => setCompletedLast(e.target.checked)}
                        />
                        <label htmlFor="completedTasksLast">Completed Tasks Last</label>
                    </div>
                </li>
            </ul>
        </div>
    );
}