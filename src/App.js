import React, {useEffect, useState} from 'react';
import './App.css';
import TodoList from './TodoList';
import TabBar from './TabBar';
import Footer from './Footer';
import Helmet from 'react-helmet';
import tabs from "./tabs";

const HEADERS = {
    'Authorization': `Bearer ${process.env.REACT_APP_HASS_TOKEN}`,
    'Content-Type': 'application/json'
};

const getInitialTab = () => {
    const hash = document.location.hash.replace('#', '');

    if (document.location.hash.replace('#', '') in tabs) {
        return hash;
    }

    return null;
};

const TODOS_KEY = window.location.pathname.substring(1).replace(process.env.REACT_APP_PUBLIC_URL, '') || 'todos';
console.info("Using todos key: ", TODOS_KEY);

function App() {
    const [todos, setTodos] = useState(null);
    const [tab, setTab] = useState(getInitialTab() || 'pending');

    useEffect(() => {
        document.location.hash = tab;
    }, [tab]);

    useEffect(() => {
        if (todos === null) {
            return;
        }
        const storeDataInHass = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_HASS_URL}/api/hadb/store`, {
                    method: 'POST',
                    headers: HEADERS,
                    body: JSON.stringify({ key: TODOS_KEY, value: JSON.stringify(todos) })
                });

                if (!response.ok) {
                    throw new Error('Failed to store data');
                }
            } catch (error) {
                console.error(error);
            }
        };

        storeDataInHass();
    }, [todos]);

    useEffect(() => {
        const getStoreDataFromHass = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_HASS_URL}/api/hadb/store?key=${TODOS_KEY}`, {
                    method: 'GET',
                    headers: HEADERS
                });

                if (!response.ok) {
                    throw new Error('Failed to store data');
                }

                const responseJson = await response.json();
                setTodos(JSON.parse(responseJson.data) || {});
            } catch (error) {
                console.error(error);
            }
        };

        getStoreDataFromHass();
    }, []);

    if (todos === null) {
        return <div className="loader">Chargement...</div>;
    }

    const getTaskCounts = (todos) => {
        let counts = {
            pending: 0,
            checked: 0,
            archived: 0
        };

        Object.keys(todos).forEach((todoId) => {
            const todo = todos[todoId];

            if (!todo.checked && !todo.archived) {
                counts.pending++;
            } else if (todo.checked) {
                counts.checked++;
            } else if (todo.archived) {
                counts.archived++;
            }
        });

        return counts;
    };

    return (
        <>
            <Helmet>
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
            </Helmet>
            <div className="App">
                <TabBar setTab={setTab} current={tab} counters={getTaskCounts(todos)} />
                <TodoList todos={todos} setTodos={setTodos} tab={tab} />
                <Footer setTodos={setTodos} todos={todos} />
            </div>
        </>
    );
}

export default App;
