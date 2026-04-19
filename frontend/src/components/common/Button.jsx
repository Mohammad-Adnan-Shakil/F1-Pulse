export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-accentRed text-whitePrimary hover:brightness-110",
    secondary: "bg-bgElevated text-whitePrimary border border-borderSoft hover:bg-white/10",
    ghost: "bg-transparent text-whiteMuted border border-borderSoft hover:text-whitePrimary hover:bg-white/5",
    danger: "bg-accentRed/90 text-whitePrimary hover:brightness-110",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-xl2 font-semibold tracking-wide transition-all duration-200
        ${variants[variant]} ${sizes[size]}
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

