import React from 'react';
import './TabBar.css';
import tabs from "./tabs";

function TabBar({ setTab, current, counters }) {
    return (
        <header>
            {Object.keys(tabs).map((key) => {
                const tab = tabs[key];
                return (
                    <button
                        key={'tab-btn-'+tab.id}
                        className={['tab-item ' + (current === tab.id ? 'active' : '')]}
                        onClick={() => setTab(tab.id)}>
                        <div className="inner">
                            <div className={'tab-name-inner'}>
                                {tab.icon} {counters[tab.id] === 0 ? '' : <div className="badge">{counters[tab.id]}</div>}
                            </div>
                            <span>{tab.name}</span>
                        </div>
                    </button>
                );
            })}
        </header>
    );
}

export default TabBar;
