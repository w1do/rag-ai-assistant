import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
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
                `theme-button style-1 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            <span data-text={text}>{children}</span>
        </button>
    );
}
