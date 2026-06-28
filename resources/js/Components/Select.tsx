import { SelectHTMLAttributes } from 'react';

export default function Select({
    className = '',
    children,
    ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <select
                {...props}
                className={
                    'block w-full h-[52px] rounded-[2px] border-form-input bg-form-input px-[25px] py-2 text-white-color shadow-sm transition-all focus:border-primary-color focus:ring-primary-color appearance-none ' +
                    className
                }
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-text-secondary">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>
    );
}
