export const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  disabled = false,
  className = "",
  icon = null,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="section-label mb-2 block">{label}</label>}
      <div className="relative">
        {icon ? <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-whiteMuted">{icon}</div> : null}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`surface-input ${icon ? "pl-10" : ""} ${error ? "border-accentRed" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-accentRed">{error}</p>}
    </div>
  );
};

export default Input;

