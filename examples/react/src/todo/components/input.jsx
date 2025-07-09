import React, { useCallback } from "react";

/**
 * Sanitizes user input by escaping HTML characters
 * @param {string} string - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitize = (string) => {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/gi;
    return string.replace(reg, (match) => map[match]);
};

/**
 * Validates minimum length requirement
 * @param {string} value - Value to validate
 * @param {number} min - Minimum required length
 * @returns {boolean} Whether value meets minimum length
 */
const hasValidMin = (value, min) => {
    return value.length >= min;
};

/**
 * Input component for todo creation and editing
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function called when input is submitted
 * @param {string} props.placeholder - Input placeholder text
 * @param {string} props.label - Accessible label for the input
 * @param {string} props.defaultValue - Default input value
 * @param {Function} props.onBlur - Function called when input loses focus
 * @returns {JSX.Element} Input component
 */
export function Input({ onSubmit, placeholder, label, defaultValue, onBlur }) {
    const handleBlur = useCallback(() => {
        if (onBlur)
            onBlur();
    }, [onBlur]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter") {
                const value = e.target.value.trim();

                if (!hasValidMin(value, 2))
                    return;

                onSubmit(sanitize(value));
                e.target.value = "";
            }
        },
        [onSubmit]
    );

    return (
        <div className="input-container">
            <input className="new-todo" id="todo-input" type="text" data-testid="text-input" autoFocus placeholder={placeholder} defaultValue={defaultValue} onBlur={handleBlur} onKeyDown={handleKeyDown} />
            <label className="visually-hidden" htmlFor="todo-input">
                {label}
            </label>
        </div>
    );
}
