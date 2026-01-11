import { useEffect } from 'react';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    showClose = true,
    size = 'md',
    className = ''
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    };

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div
                className={`modal-content animate-slide-up ${sizes[size]} ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {(title || showClose) && (
                    <div className="flex items-center justify-between mb-5">
                        {title && (
                            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        )}
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors -mr-2"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
