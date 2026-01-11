import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon,
    fullWidth = true,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            input-field
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-400 focus:border-red-500' : ''}
            ${className}
          `.trim()}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
