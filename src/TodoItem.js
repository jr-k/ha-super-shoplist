import React, { useState } from 'react';
import './TodoItem.css';

function TodoItem({ id, text, striked, checked, onChecked, onStriked, onArchive, onDelete }) {
    const [strikethrough, setStrikethrough] = useState(striked);
    const [ticked, setTicked] = useState(checked);

    const handleTextClick = () => {
        setStrikethrough(!strikethrough);
        onStriked(id, !strikethrough);
    };

    const handleCheckboxClick = () => {
        setTicked(!ticked);
        onChecked(id, !ticked);
    };

    const handleArchiveClick = () => {
        onArchive(id, !ticked);
    };

    const handleDeleteClick = () => {
        onDelete(id);
    };

    return (
        <div className={`todo-item ${strikethrough ? 'strikethrough' : ''} ${ticked ? 'checked' : ''}`}>
            <input type="checkbox" checked={ticked} onChange={handleCheckboxClick} />
            <span onClick={handleTextClick}>{text}</span>
            <div className="options">
                <button className={'delete'} onClick={handleDeleteClick}>
                    <i className={"fa fa-trash"}></i>
                </button>
                <button className={'archive'} onClick={handleArchiveClick}>
                    <i className={"fa fa-mail-forward"}></i>
                </button>
            </div>
        </div>
    );
}

export default TodoItem;