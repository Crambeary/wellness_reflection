export default function InputButton({
    children,
    onClick = () => {},
    className,
    disabled,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}) {
    return (
        <button
            data-html2canvas-ignore
            className={`btn btn-outline-secondary col-1 px-1 py-0 ${className}`}
            onClick={onClick}
            type="button"
            disabled={disabled}
        >
            {children}
        </button>
    );
}