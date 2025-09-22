import MaterialIcon from "@/components/common/MaterialIcon";

interface DashboardButtonProps {
    text: string;
    icon?: string;
    onClick: () => void;
    className?: string;
    textClassName?: string;
    type?: "button" | "submit" | "reset";
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
                                                             text,
                                                             icon,
                                                             onClick,
                                                             className = "primary",
                                                             textClassName = "",
                                                             type = "button",
                                                         }) => {
    return (
        <button
            type={type}
            className={`d-flex align-items-center gap-2 rounded-5 border-0 px-3 py-1 ${className}`}
            onClick={onClick}
        >
            {icon && <MaterialIcon name={icon}/>}
            <span className={textClassName}>{text}</span>
        </button>
    );
};

export default DashboardButton;