export default function Card({
    children,
    variant = 'default',
    padding = 'md',
    className = '',
    onClick,
    hoverable = false,
    style,
}) {
    const variants = {
        default: 'card',
        glass: 'card-glass',
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6',
    };

    return (
        <div
            className={`
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverable ? 'cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200' : ''}
        ${className}
      `.trim()}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
}
