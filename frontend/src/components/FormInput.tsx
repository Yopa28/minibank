import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
    label: string;
    error?: string;
    type?: string;
    options?: { value: string | number; label: string }[];
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    error,
    type = 'text',
    options,
    className,
    ...props
}) => {
    const isSelect = type === 'select';

    return (
        <div className={cn("mb-4", className)}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>

            {isSelect ? (
                <select
                    className={cn(
                        "block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all",
                        error ? "border-red-300 text-red-900" : "border-slate-300 text-slate-900"
                    )}
                    {...(props as any)}
                >
                    <option value="">Select an option</option>
                    {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    className={cn(
                        "block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all",
                        error ? "border-red-300 text-red-900 placeholder-red-300" : "border-slate-300 text-slate-900"
                    )}
                    {...(props as any)}
                />
            )}

            {error && (
                <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
            )}
        </div>
    );
};
