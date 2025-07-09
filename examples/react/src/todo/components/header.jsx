import React, { useCallback } from "react";
import { Input } from "./input";
import { ThemeToggle } from "./theme-toggle";

import { createTodo } from "../actions";

/**
 * Header component containing the app title, theme toggle, and new todo input
 * @param {Object} props - Component props
 * @param {Function} props.dispatch - Dispatch function for actions
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {boolean} props.creating - Whether a todo is being created
 * @returns {JSX.Element} Header component
 */
export function Header({ dispatch, theme, creating }) {
    const addItem = useCallback((title) => createTodo(dispatch)(title), [dispatch]);

    return (
        <header className="header" data-testid="header">
            <div className="header-content">
                <h1>todos</h1>
                <ThemeToggle dispatch={dispatch} theme={theme} />
            </div>
            <div className={creating ? "creating-indicator" : ""}>
                <Input onSubmit={addItem} placeholder="What needs to be done?" label="New Todo Input" />
            </div>
        </header>
    );
}
