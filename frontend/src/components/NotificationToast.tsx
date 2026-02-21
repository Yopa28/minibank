import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type ToastType = 'success' | 'error' | 'info';

interface NotificationToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
    message,
    type = 'info',
    onClose,
    duration = 5000
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <AlertCircle className="w-5 h-5 text-primary-500" />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-primary-50 border-primary-200',
    };

    return (
        <div className={cn(
            "fixed top-4 right-4 z-[100] flex items-center p-4 min-w-[300px] border rounded-lg shadow-lg animate-in slide-in-from-right",
            bgColors[type]
        )}>
            <div className="mr-3">{icons[type]}</div>
            <div className="flex-1 text-sm font-medium text-slate-800">
                {message}
            </div>
            <button
                onClick={onClose}
                className="ml-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
