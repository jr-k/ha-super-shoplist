import React from 'react';
import './TodoList.css';
import TodoItem from "./TodoItem";
import categories from "./categories";
import logic from "./logic";

function TodoList({ todos, setTodos, tab }) {
    const toggleDelete = (id) => {
        const newTodos = {...todos};
        delete newTodos[id];
        setTodos(newTodos);
    };

    const toggleTodo = (id) => {
        const newTodos = {...todos};
        newTodos[id].checked = !newTodos[id].checked;
        setTodos(newTodos);
    };

    const toggleArchived = (id) => {
        const newTodos = {...todos};
        newTodos[id].archived = !newTodos[id].archived;
        setTodos(newTodos);
    };

    const toggleStriked = (id) => {
        const newTodos = {...todos};
        newTodos[id].striked = !newTodos[id].striked;
        setTodos(newTodos);
    };

    const filterTodos = () => {
        return Object.keys(todos)
            .filter((key) => logic.getTabByTodo(todos[key]) === tab)
            .map((key) => todos[key]);
    };

    const groupByCategory = (array) => {
        return array.reduce((result, item) => {
            if (item.category !== undefined) {
                (result[item.category] = result[item.category] || []).push(item);
            }
            return result;
        }, {});
    };

    const filteredTodos = filterTodos();
    const todosByCategory = groupByCategory(filteredTodos);
    const sortedTodosByCategory = Object.keys(categories).reduce((acc, key) => {
        if (todosByCategory[key]) {
            acc[key] = todosByCategory[key];
        }
        return acc;
    }, {});

    return (
        <main>
            <div className="todo-list">
                {Object.keys(sortedTodosByCategory).map(categoryId => {
                    return (
                        <div key={categoryId} className={"category-items"}>
                            <h2>{categories[categoryId].icon} <span>{categories[categoryId].name}</span></h2>
                            {sortedTodosByCategory[categoryId].map((todo, index) => (
                                <div key={todo.text}>
                                    <TodoItem
                                        id={todo.id}
                                        text={todo.text}
                                        checked={todo.checked}
                                        striked={todo.striked}
                                        onChecked={() => toggleTodo(todo.id)}
                                        onStriked={() => toggleStriked(todo.id)}
                                        onArchive={() => toggleArchived(todo.id)}
                                        onDelete={() => toggleDelete(todo.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </main>
    );
}

export default TodoList;
