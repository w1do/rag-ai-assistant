import { HTMLAttributes } from 'react';

export default function InputHint({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={'mt-1.5 text-xs text-text-secondary/70 italic ' + className}
        >
            {message}
        </p>
    ) : null;
}
