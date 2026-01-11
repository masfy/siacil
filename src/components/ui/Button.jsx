export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    icon,
    onClick,
    type = 'button',
    className = ''
}) {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        gradient: 'btn-gradient',
        success: 'btn-success',
        danger: 'btn-danger',
        ghost: 'px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm rounded-xl',
        md: 'px-5 py-3 text-sm rounded-full',
        lg: 'px-6 py-3.5 text-base rounded-full',
    };

    // Override size for non-pill variants
    const sizeClass = variants[variant]?.includes('btn-') ? '' : sizes[size];

    const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizeClass}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : icon ? (
                icon
            ) : null}
            {children}
        </button>
    );
}
