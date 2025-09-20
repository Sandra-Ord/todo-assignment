interface MaterialIconProps {
    name: string;
    className?: string;
    onClick?: () => void;
}

export default function MaterialIcon({name, className = "", onClick}: MaterialIconProps) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            onClick={onClick}>
            {name}
        </span>
    );
}