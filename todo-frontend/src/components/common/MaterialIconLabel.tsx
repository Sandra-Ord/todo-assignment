import MaterialIcon from "@/components/common/MaterialIcon";

interface MaterialIconLabelProps {
    name: string;
    label: string;
    className?: string;
    spanClassName?: string;
    onClick?: () => void;
}

export default function MaterialIconLabel({
                                              name,
                                              label,
                                              className = "",
                                              spanClassName = "",
                                              onClick
                                          }: MaterialIconLabelProps) {
    const containerClasses = `d-flex align-items-center gap-2 ${onClick ? "touchable-element" : ""} ${className}`.trim();

    return (
        <span className={containerClasses} onClick={onClick}>
            <MaterialIcon name={name}/>
            <span className={spanClassName}>{label}</span>
        </span>
    );
}