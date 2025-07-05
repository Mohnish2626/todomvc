import { useReducer, useEffect } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

import { appReducer } from "./reducer";
import { fetchTodos } from "./actions";

import "./app.css";

export function App() {
    const [state, dispatch] = useReducer(appReducer, { 
        todos: [], 
        theme: 'light',
        loading: false,
        creating: false,
        updating: null,
        deleting: null,
        error: null
    });

    useEffect(() => {
        fetchTodos(dispatch)();
    }, []);

    useEffect(() => {
        document.body.className = state.theme === 'dark' ? 'dark-theme' : 'light-theme';
    }, [state.theme]);

    return (
        <div className="todoapp">
            <Header dispatch={dispatch} theme={state.theme} creating={state.creating} />
            <Main state={state} dispatch={dispatch} />
            <Footer todos={state.todos} dispatch={dispatch} />
        </div>
    );
}
