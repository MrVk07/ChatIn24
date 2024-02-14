const Button = ({ onClick, text, className }) => (
    <button className={`py-2 px-4 rounded cursor-pointer text-white font-bold  focus:shadow-outline ${className}`}
        onClick={onClick}>
        {text}
    </button>
);

export default Button;
