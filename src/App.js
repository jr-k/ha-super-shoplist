import React, {useEffect, useState} from 'react';
import './App.css';
import TodoList from './TodoList';
import TabBar from './TabBar';
import Footer from './Footer';
import Helmet from 'react-helmet';
import tabs from "./tabs";
import logic from "./logic";
import useSwipeTabs from "./useSwipeTabs";
import OfflineModeMenu from "./OfflineModeMenu";

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

const TODOS_KEY = window.location.pathname.replace(process.env.PUBLIC_URL, '').substring(1) || 'todos';
console.info("Using todos key: ", TODOS_KEY);

function App() {
    const [init, setInit] = useState(true);
    const [needRefresh, setNeedRefresh] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuperLoading, setSuperLoading] = useState(false);
    const [todos, setTodos] = useState(null);
    const [tab, setTab] = useState(getInitialTab() || 'pending');
    const [offlineMode, setOfflineMode] = useState(false);

    //useSwipeTabs(tab, setTab, Object.keys(tabs));

    const persistRemoteStore = async (persistedTodos, forceSync) => {
        if (persistedTodos === undefined || persistedTodos === null) {
            return;
        }

        if (!offlineMode || forceSync || init) {
            const response = await fetch(`${process.env.REACT_APP_HASS_URL}/api/hadb/store`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({key: TODOS_KEY, value: JSON.stringify(persistedTodos)})
            });

            if (!response.ok) {
                throw new Error('Failed to store data');
            }
        }

        setTodos(persistedTodos);
    };

    const fetchRemoteStore = async () => {
        if (offlineMode && !init) {
            if (isLoading) {
                setIsLoading(false);
            }
            return todos;
        }

        if (isLoading) return;
        setIsLoading(true);
        let result = undefined;
        const startTime = performance.now();

        try {
            const response = await fetch(`${process.env.REACT_APP_HASS_URL}/api/hadb/store?key=${TODOS_KEY}`, {
                method: 'GET',
                headers: HEADERS
            });

            if (!response.ok) {
                throw new Error('Failed to store data');
            }

            const responseJson = await response.json();
            result = JSON.parse(responseJson.data) || {};

            const endTime = performance.now();
            const timeElapsed = endTime - startTime;

            if (timeElapsed > 2000 && !offlineMode && !init) {
                setOfflineMode(true);
                result = todos;
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);

            if (init) {
                setInit(false);
            }
        }

        return result;
    };

    const addTodos = (newTodos) => {
        const storeDataInHass = async () => {
            try {
                const remoteStore = await fetchRemoteStore();

                if (remoteStore === undefined) {
                    return;
                }

                const persistedTodos = {...remoteStore, ...newTodos};
                await persistRemoteStore(persistedTodos);
            } catch (error) {
                console.error(error);
            }
        };

        storeDataInHass();
    }


    const updateTodo = (updatedTodoId, nextTodos) => {
        const storeDataInHass = async () => {
            try {
                const remoteStore = await fetchRemoteStore();

                if (remoteStore === undefined) {
                    return;
                }

                const updatedStore = {};

                if (updatedTodoId in remoteStore) {
                    delete remoteStore[updatedTodoId];
                }

                if (updatedTodoId in nextTodos) {
                    updatedStore[updatedTodoId] = nextTodos[updatedTodoId];
                }

                const persistedTodos = {...nextTodos, ...remoteStore, ...updatedStore};
                await persistRemoteStore(persistedTodos);
            } catch (error) {
                console.error(error);
            }
        };

        storeDataInHass();
    };

    useEffect(() => {
        document.location.hash = tab;
    }, [tab]);

    useEffect(() => {
        if (offlineMode) {
            return;
        } else if (!init) {
            setSuperLoading(true);
            persistRemoteStore(todos);
        }

        const interval = setInterval(() => {
            setNeedRefresh(true);
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [offlineMode]);

    useEffect(() => {
        const handleEvent = () => {
            setNeedRefresh(true);
        }

        window.addEventListener('visibilitychange', handleEvent);

        return () => {
            window.removeEventListener('visibilitychange', handleEvent);
        };
    }, []);

    useEffect(() => {
        if (!needRefresh) return;

        const refreshFromRemoteStore = async () => {
            const remoteItems = await fetchRemoteStore();

            setNeedRefresh(false);

            if (remoteItems === undefined) {
                return;
            }

            setTodos({...remoteItems});
        };

        if (needRefresh) {
            refreshFromRemoteStore();
        }
    }, [fetchRemoteStore, needRefresh]);

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

            switch(logic.getTabByTodo(todo)) {
                case 'pending':
                    counts.pending++;
                    break;
                case 'checked':
                    counts.checked++;
                    break;
                case 'archived':
                    counts.archived++;
                    break;
            }
        });

        return counts;
    };

    if (init) {
        return null;
    }

    return (
        <>
            {/*<Helmet>*/}
            {/*    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />*/}
            {/*</Helmet>*/}
            <div className="App">
                <OfflineModeMenu active={offlineMode} setOfflineMode={setOfflineMode} />
                <TabBar setTab={setTab} current={tab} counters={getTaskCounts(todos)} />
                <TodoList todos={todos} updateTodo={updateTodo} tab={tab} />
                <Footer addTodos={addTodos} tab={tab} />
            </div>
        </>
    );
}

export default App;
