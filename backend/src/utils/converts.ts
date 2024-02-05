import { ParsedQs } from 'qs';

export function convertToNumber(value: string | ParsedQs | string[] | ParsedQs[] | undefined , defaultValue: number): number {
    let result: number;

    if (typeof value === 'string') {
        result = parseInt(value, 10) || defaultValue;
    } else if (Array.isArray(value)) {
        // Assuming you want to convert the first item if it's an array
        result = parseInt(typeof value[0] === 'string' ? value[0] : '', 10) || defaultValue;
    } else {
        // Default or fallback value if conversion isn't possible
        result = defaultValue;
    }

    return result;
}