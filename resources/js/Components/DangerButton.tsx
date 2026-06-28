import { ButtonHTMLAttributes } from 'react';

export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    const text = typeof children === 'string' ? children : '';

    return (
        <button
            {...props}
            className={
                `theme-button !bg-red-600/20 !border-red-600/50 !text-red-500 hover:!bg-red-600 hover:!text-white-color transition-all duration-500 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            <span data-text={text}>{children}</span>
        </button>
    );
}
