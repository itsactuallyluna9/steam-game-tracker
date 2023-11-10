"use client";
import { useState } from "react";

/**
 * A custom hook that returns a stateful value and functions to update it, while also persisting the value in localStorage.
 * @param initialValue - The initial value of the state.
 * @param key - The key to use when storing the value in localStorage.
 * @returns An array containing the current value, a function to update the value and a function to update the value without persisting it in localStorage.
 * @author Mark Smith <totallynotmark6@gmail.com>
 */
export default function useStateLocalStorage(initalValue: any, key: string) {
    if (typeof window === "undefined") {
        // If window is undefined, we're on the server and we can't use localStorage.
        // Return a normal useState hook.
        const [value, setValue] = useState(initalValue);
        return [value, setValue, setValue]; // Return the same function twice so the return type is the same as the custom hook.
    };
    const [value, setValue] = useState(() => {
        const stickyValue = window.localStorage.getItem(key);
        return stickyValue !== null ? JSON.parse(stickyValue) : initalValue;
    });

    const setStickyValue = (value: any) => {
        setValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    return [value, setStickyValue, setValue];
}