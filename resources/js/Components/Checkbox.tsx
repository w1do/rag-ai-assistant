import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-[2px] border-border-color-one bg-extra-color-two text-primary-color shadow-sm focus:ring-primary-color ' +
                className
            }
        />
    );
}
