import { memo, useState, useCallback } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { updateTodo, deleteTodo } from "../actions";

export const Item = memo(function Item({ todo, dispatch, index, isUpdating, isDeleting }) {
    const [isWritable, setIsWritable] = useState(false);
    const { title, completed, id } = todo;

    const toggleItem = useCallback(() => updateTodo(dispatch)(id, { ...todo, completed: !completed }), [dispatch, id, todo, completed]);
    const removeItem = useCallback(() => deleteTodo(dispatch)(id), [dispatch, id]);
    const updateItem = useCallback((newTitle) => updateTodo(dispatch)(id, { ...todo, title: newTitle }), [dispatch, id, todo]);

    const handleDoubleClick = useCallback(() => {
        setIsWritable(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsWritable(false);
    }, []);

    const handleUpdate = useCallback(
        (newTitle) => {
            if (newTitle.length === 0)
                removeItem();
            else
                updateItem(newTitle);

            setIsWritable(false);
        },
        [removeItem, updateItem]
    );

    return (
        <li className={classnames({ 
            completed: todo.completed,
            updating: isUpdating,
            deleting: isDeleting
        })} data-testid="todo-item">
            <div className="view">
                {isWritable ? (
                    <Input onSubmit={handleUpdate} label="Edit Todo Input" defaultValue={title} onBlur={handleBlur} />
                ) : (
                    <>
                        <input 
                            className="toggle" 
                            type="checkbox" 
                            data-testid="todo-item-toggle" 
                            checked={completed} 
                            onChange={toggleItem}
                            disabled={isUpdating || isDeleting}
                        />
                        <label 
                            data-testid="todo-item-label" 
                            onDoubleClick={handleDoubleClick}
                            className={isUpdating ? "updating-text" : ""}
                        >
                            {title}
                            {isUpdating && <span className="updating-spinner">⟳</span>}
                        </label>
                        <button 
                            className="destroy" 
                            data-testid="todo-item-button" 
                            onClick={removeItem}
                            disabled={isUpdating || isDeleting}
                        />
                        {isDeleting && <span className="deleting-spinner">⟳</span>}
                    </>
                )}
            </div>
        </li>
    );
});
