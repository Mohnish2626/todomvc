import React, { useCallback } from "react";
import { TOGGLE_THEME } from "../constants";

/**
 * Theme toggle component for switching between light and dark modes
 * @param {Object} props - Component props
 * @param {Function} props.dispatch - Dispatch function for actions
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @returns {JSX.Element} Theme toggle button
 */
export function ThemeToggle({ dispatch, theme }) {
    const toggleTheme = useCallback(() => {
        dispatch({ type: TOGGLE_THEME });
    }, [dispatch]);

    return (
        <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="theme-toggle-track">
                <div className="theme-toggle-thumb">
                    <span className="theme-icon">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </span>
                </div>
            </div>
        </button>
    );
}
