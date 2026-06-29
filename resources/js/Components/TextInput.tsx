import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'h-[52px] w-full rounded-one border border-border-color-one bg-extra-color-two px-[25px] py-2 text-white-color shadow-sm transition-all duration-300 focus:border-primary-color focus:ring-1 focus:ring-primary-color placeholder:text-text-secondary-dark/50 hover:border-white/20 ' +
                className
            }
            ref={localRef}
        />
    );
});
