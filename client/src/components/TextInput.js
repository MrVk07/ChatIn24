const TextInput = ({ value, onChange, placeholder, onKeyPress }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            id={placeholder}
            onKeyPress={onKeyPress}
            className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 mt-2"
        />
    );
};

export default TextInput;