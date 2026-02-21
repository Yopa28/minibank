import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    rowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    loading,
    emptyMessage = "No data found",
    rowClick
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="flex flex-col space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 w-full bg-slate-100 animate-pulse rounded-md" />
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500 font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-100">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={cn("px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider", col.className)}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className={cn(
                                "group transition-colors hover:bg-slate-50/80",
                                rowClick && "cursor-pointer"
                            )}
                            onClick={() => rowClick?.(item)}
                        >
                            {columns.map((col, idx) => (
                                <td
                                    key={idx}
                                    className={cn("px-6 py-4 text-sm text-slate-700", col.className)}
                                >
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(item)
                                        : (item[col.accessor] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
