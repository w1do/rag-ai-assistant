import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    const text = typeof children === 'string' ? children : '';

    return (
        <button
            {...props}
            type={type}
            className={
                `theme-button style-2 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            <span data-text={text}>{children}</span>
        </button>
    );
}
