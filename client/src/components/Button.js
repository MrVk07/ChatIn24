const Button = ({ onClick, disabled, text, className }) => (
    <button
        className={`py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer ${className}`}
        onClick={onClick}
        disabled={disabled}
    >
        {text}
    </button>
);

export default Button;