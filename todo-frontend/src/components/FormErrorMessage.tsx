interface FormErrorMessageProps {
    message: string;
}

export default function FormErrorMessage({message}: FormErrorMessageProps) {
    return (
        <div className="text-end small text-danger">{message}</div>

    );
}