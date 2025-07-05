import { useCallback } from "react";
import { Input } from "./input";
import { ThemeToggle } from "./theme-toggle";

import { createTodo } from "../actions";

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
