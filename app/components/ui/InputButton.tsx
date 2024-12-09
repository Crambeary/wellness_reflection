
export default function InputButton({
    children,
    onClick,
    className
}: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            data-html2canvas-ignore
            className={`btn btn-outline-secondary col-1 px-1 py-0 ${className}`}
            onClick={onClick}
            type="button"
        >
            {children}
        </button>
    );
}