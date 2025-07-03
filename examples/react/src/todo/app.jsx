import { useReducer, useEffect } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

import { appReducer } from "./reducer";

import "./app.css";

export function App() {
    const [state, dispatch] = useReducer(appReducer, { todos: [], theme: 'light' });

    useEffect(() => {
        document.body.className = state.theme === 'dark' ? 'dark-theme' : 'light-theme';
    }, [state.theme]);

    return (
        <div className="todoapp">
            <Header dispatch={dispatch} theme={state.theme} />
            <Main todos={state.todos} dispatch={dispatch} />
            <Footer todos={state.todos} dispatch={dispatch} />
        </div>
    );
}
