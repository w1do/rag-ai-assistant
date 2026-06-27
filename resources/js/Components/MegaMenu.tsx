import { Popover, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { Fragment, ReactNode } from 'react';

interface MegaMenuProps {
    title: string;
    active?: boolean;
    children: ReactNode;
}

export default function MegaMenu({ title, active, children }: MegaMenuProps) {
    return (
        <Popover className="flex">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`
                            inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none outline-none cursor-pointer
                            ${active 
                                ? 'border-indigo-400 text-gray-900' 
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                        `}
                    >
                        <span>{title}</span>
                        <ChevronDown
                            className={`ms-1 h-4 w-4 transition duration-150 ease-in-out ${open ? 'rotate-180' : ''}`}
                        />
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute inset-x-0 z-50 mt-px">
                            <div className="bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                                    <div className="grid grid-cols-3 gap-8 divide-x divide-gray-100">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
