import { useCallback } from "react";
import { TOGGLE_THEME } from "../constants";

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
