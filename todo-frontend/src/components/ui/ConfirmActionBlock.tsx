import ConfirmActionButtons from "@/components/ui/ConfirmActionButtons";

interface ConfirmActionBlockProps {
    message: string;
    confirmText: string;
    confirmIcon: string;
    confirmClass: "success" | "danger" | "warning" | "primary";
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmActionBlock({
                                               message,
                                               confirmText,
                                               confirmIcon,
                                               confirmClass,
                                               onConfirm,
                                               onCancel,
                                           }: ConfirmActionBlockProps) {
    return (
        <div className="d-flex flex-column gap-4">
            <div className="text-center text-muted">{message}</div>
            <ConfirmActionButtons
                confirmText={confirmText}
                confirmIcon={confirmIcon}
                confirmClass={confirmClass}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        </div>
    );
}