import { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { Item } from "./item";
import classnames from "classnames";

import { TOGGLE_ALL } from "../constants";
import { clearError } from "../actions";

export function Main({ state, dispatch }) {
    const { pathname: route } = useLocation();
    const { todos, loading, error, updating, deleting } = state;

    const visibleTodos = useMemo(
        () =>
            todos.filter((todo) => {
                if (route === "/active")
                    return !todo.completed;

                if (route === "/completed")
                    return todo.completed;

                return true;
            }),
        [todos, route]
    );

    const toggleAll = useCallback((e) => dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }), [dispatch]);
    
    const handleClearError = useCallback(() => clearError(dispatch)(), [dispatch]);

    return (
        <main className="main" data-testid="main">
            {loading && (
                <div className="loading-spinner">Loading todos...</div>
            )}
            {error && (
                <div className="error-message">
                    <span>Error: {error}</span>
                    <button onClick={handleClearError} className="error-dismiss">×</button>
                </div>
            )}
            {!loading && visibleTodos.length > 0 ? (
                <div className="toggle-all-container">
                    <input className="toggle-all" type="checkbox" id="toggle-all" data-testid="toggle-all" checked={visibleTodos.every((todo) => todo.completed)} onChange={toggleAll} />
                    <label className="toggle-all-label" htmlFor="toggle-all">
                        Toggle All Input
                    </label>
                </div>
            ) : null}
            <ul className={classnames("todo-list")} data-testid="todo-list">
                {visibleTodos.map((todo, index) => (
                    <Item 
                        todo={todo} 
                        key={todo.id} 
                        dispatch={dispatch} 
                        index={index}
                        isUpdating={updating === todo.id}
                        isDeleting={deleting === todo.id}
                    />
                ))}
            </ul>
        </main>
    );
}
