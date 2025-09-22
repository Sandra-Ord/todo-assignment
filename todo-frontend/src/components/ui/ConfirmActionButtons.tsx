import DashboardButton from "@/components/common/DashboardButton";

interface ConfirmActionButtonsProps {
    confirmText: string;
    confirmIcon: string;
    confirmClass: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmActionButtons({
                                                 confirmText,
                                                 confirmIcon,
                                                 confirmClass,
                                                 onConfirm,
                                                 onCancel
                                             }: ConfirmActionButtonsProps) {
    return (
        <div className="d-flex justify-content-between px-lg-5 px-md-3 px-sm-5 py-2">
            <DashboardButton text={confirmText}
                             icon={confirmIcon}
                             className={confirmClass}
                             onClick={onConfirm}/>
            <DashboardButton text="Cancel"
                             icon="cancel"
                             className="cancel"
                             onClick={onCancel}/>
        </div>
    );
}