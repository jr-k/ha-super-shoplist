import React, { useState } from 'react';
import './TodoItem.css';

function TodoItem({ id, text, striked, archived, checked, tab, onChecked, onStriked, onArchive, onDelete }) {
    const handleTextClick = () => {
        onStriked(id, !striked);
    };

    const handleCheckboxClick = () => {
        onChecked(id, !checked);
    };

    const handleArchiveClick = () => {
        onArchive(id, !archived);
    };

    const handleDeleteClick = () => {
        onDelete(id);
    };

    return (
        <div className={`todo-item ${striked ? 'strikethrough' : ''} ${checked ? 'checked' : ''}`}>
            <input type="checkbox" checked={checked} onChange={handleCheckboxClick} />
            <span onClick={handleTextClick}>{text}</span>
            <div className="options">
                <button className={'delete'} onClick={handleDeleteClick}>
                    <i className={"fa fa-trash"}></i>
                </button>
                <button className={'archive '+(tab === 'archived' ? 'archive-off' : '')} onClick={handleArchiveClick}>
                    <i className={"fa "+(tab === 'archived' ? 'fa-reply' : 'fa-mail-forward')}></i>
                </button>
            </div>
        </div>
    );
}

export default TodoItem;