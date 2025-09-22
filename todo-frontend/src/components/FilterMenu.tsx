import {IFilter} from "@/domain/IFilter";
import MaterialIcon from "@/components/common/MaterialIcon";
import MaterialIconLabel from "@/components/common/MaterialIconLabel";

interface FilterMenuProps {
    filter: IFilter;
    setFilter: (value: IFilter) => void;
}

export default function FilterMenu({filter, setFilter}: FilterMenuProps) {
    return (
        <div className="btn-group">
            <span
                role="button"
                className="dropdown-toggle d-flex align-items-center gap-2 touchable-element"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-auto-close="outside"
            >
                <MaterialIconLabel label="Filter by" name="filter_list" className="flex-row-reverse" spanClassName="d-md-none d-lg-inline"/>
            </span>
            <ul className="dropdown-menu dropdown-menu-end">
                <li className="px-3 py-1 dropdown-item">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={filter.completed === true}
                            onChange={(e) => {
                                const completed = e.target.checked;
                                setFilter({
                                    ...filter,
                                    completed: completed
                                        ? filter.completed === false
                                            ? null
                                            : true
                                        : filter.completed === true
                                            ? null
                                            : false,
                                });
                            }}
                            id="completedCheck"
                        />
                        <label className="form-check-label" htmlFor="completedCheck">
                            Completed
                        </label>
                    </div>
                </li>

                <li className="px-3 py-1 dropdown-item">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={filter.completed === false}
                            onChange={(e) => {
                                const uncompleted = e.target.checked;
                                setFilter({
                                    ...filter,
                                    completed: uncompleted
                                        ? filter.completed === true
                                            ? null
                                            : false
                                        : filter.completed === false
                                            ? null
                                            : true,
                                });
                            }}
                            id="uncompletedCheck"
                        />
                        <label className="form-check-label" htmlFor="uncompletedCheck">
                            Not Completed
                        </label>
                    </div>
                </li>

                <li className="px-3 py-1">
                    <div className="fw-semibold small text-muted mb-2">Due Date Range</div>
                    <div className="d-flex flex-column gap-2">
                        <div>
                            <label htmlFor="DueDateFrom" className="form-label small text-muted">
                                From
                            </label>
                            <input
                                type="datetime-local"
                                id="DueDateFrom"
                                className="rounded-5 border-0 px-3 py-1 w-100 shadow-sm"
                                value={filter.dueDateFrom}
                                onChange={(e) => setFilter({...filter, dueDateFrom: e.target.value})}
                            />
                        </div>
                        <div>
                            <label htmlFor="DueDateUntil" className="form-label small text-muted">
                                Until
                            </label>
                            <input
                                type="datetime-local"
                                id="DueDateUntil"
                                className="rounded-5 border-0 px-3 py-1 w-100 shadow-sm"
                                value={filter.dueDateUntil}
                                onChange={(e) => setFilter({...filter, dueDateUntil: e.target.value})}
                            />
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}