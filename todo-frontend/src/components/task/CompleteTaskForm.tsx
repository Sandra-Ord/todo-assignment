import ConfirmActionButtons from "@/components/ui/ConfirmActionButtons";

interface CompleteTaskFormProps {
    standardInputClassnames: string;
    completedDate: string;
    setCompletedDate: (value: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function CompleteTaskForm({
                                             standardInputClassnames,
                                             completedDate,
                                             setCompletedDate,
                                             onConfirm,
                                             onCancel,
                                         }: CompleteTaskFormProps) {
    return (
        <div className="d-flex flex-column gap-4">
            <div className="d-flex justify-content-between align-items-center pt-4">
                <span className="fw-bold">Task completed as of</span>
                <input
                    className={standardInputClassnames}
                    type="datetime-local"
                    onChange={(e) => setCompletedDate(e.target.value)}
                    value={completedDate}
                />
            </div>
            <ConfirmActionButtons
                confirmText="Complete"
                confirmIcon="check_box"
                confirmClass="success"
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        </div>
    );
}