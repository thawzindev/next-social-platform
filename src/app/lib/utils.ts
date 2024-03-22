import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isObjectId(n: string) {
    return /^[0-9a-fA-F]{24}$/.test(n);
}
