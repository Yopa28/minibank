import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, className, headerAction }) => {
    return (
        <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)}>
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
                        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: { value: string; positive: boolean };
    color?: string;
}> = ({ title, value, icon: Icon, trend, color = "bg-primary-600" }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg text-white", color)}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        trend.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {trend.value}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
            </div>
        </div>
    );
};
