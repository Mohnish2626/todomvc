import { useCallback } from "react";
import { Input } from "./input";
import { ThemeToggle } from "./theme-toggle";

import { ADD_ITEM } from "../constants";

export function Header({ dispatch, theme }) {
    const addItem = useCallback((title) => dispatch({ type: ADD_ITEM, payload: { title } }), [dispatch]);

    return (
        <header className="header" data-testid="header">
            <div className="header-content">
                <h1>todos</h1>
                <ThemeToggle dispatch={dispatch} theme={theme} />
            </div>
            <Input onSubmit={addItem} label="New Todo Input" placeholder="What needs to be done?" />
        </header>
    );
}
