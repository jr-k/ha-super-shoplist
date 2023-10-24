import React from 'react';
import './OfflineModeMenu.css';

function OfflineModeMenu({ active, setOfflineMode }) {
    if (!active) {
        return null;
    }

    return (
        <div className={['offline-banner']} onClick={() => { setOfflineMode(!active); }}>
            {active ? 'ON': 'OFF'}
        </div>
    );
}

export default OfflineModeMenu;
