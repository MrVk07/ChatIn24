const TextInput = ({ value, onChange, placeholder }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
        />
    );
};

export default TextInput;