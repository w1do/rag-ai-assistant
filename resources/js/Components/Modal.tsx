import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { PropsWithChildren } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}: PropsWithChildren<{
    show: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeable?: boolean;
    onClose: CallableFunction;
}>) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Dialog open={show} onClose={close} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity duration-300 ease-out data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 z-10 flex items-center overflow-y-auto px-4 py-6 sm:px-0">
                <DialogPanel
                    transition
                    className={`mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 ease-out data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 sm:mx-auto sm:w-full ${maxWidthClass}`}
                >
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    );
}
