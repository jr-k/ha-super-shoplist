import React, { useState, useRef, useEffect } from 'react';
import './AddItemModal.css';
import categories from "./categories";

export default function AddItemModal({ isOpen, onClose, addItems }) {
    const [activeCategory, setActiveCategory] = useState("meat");
    const [textAreas, setTextAreas] = useState({});
    const activeTextAreaRef = useRef(null);

    const handleTextAreaChange = (categoryId, value) => {
        setTextAreas({
            ...textAreas,
            [categoryId]: value,
        });
    };

    useEffect(() => {
        if (activeTextAreaRef.current) {
            activeTextAreaRef.current.focus();
        }
    }, [activeCategory]);

    useEffect(() => {
        if (isOpen && activeTextAreaRef.current) {
            activeTextAreaRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const counters = {};
    Object.keys(textAreas).forEach(categoryId => {
        let count = 0;
        const lines = textAreas[categoryId].split('\n');
        lines.forEach(line => {
            if (line.trim() !== '') {
                count++;
            }
        });
        counters[categoryId] = count;
    });
    const totalCounters = Object.values(counters).reduce((acc, curr) => acc + curr, 0);


    const handleSubmit = () => {
        if (totalCounters === 0) return;

        const items = {};

        Object.keys(textAreas).forEach(categoryId => {
            const lines = textAreas[categoryId].split('\n');
            lines.forEach(line => {
                if (line.trim() !== '') {
                    items[line] = {
                        text: line,
                        id: line,
                        category: categoryId,
                        striked: false,
                        checked: false,
                        archived: false
                    };
                }
            });
        });

        addItems(items);
        setTextAreas({})

        onClose();
    };


    return (
        <div className="modal">
            <div className="modal-content">
                <div className="top-actions">
                    <button className="close" onClick={onClose}><i className={"fa fa-times"}></i></button>
                </div>

                <div className="category-tabs">
                    {Object.keys(categories).map((categoryId) => {
                        const category = categories[categoryId];
                        const counter = counters[category.id] || 0;
                        return (
                            <button key={'category-tab-'+category.id} onClick={() => {
                                setActiveCategory(category.id)
                            }} className={(category.id === activeCategory ? 'active' : '')}>
                                {counter !== 0 ? <div className="badge">{counter}</div> : null}
                                {category.icon}
                            </button>
                        );
                    })}
                </div>
                {Object.keys(categories).map((categoryId) => {
                    const category = categories[categoryId];

                    return (
                        <div key={'category-content-'+category.id} className={"category-content category-content-"+category.id+ " " + (category.id === activeCategory ? 'active' : '')}>
                            <h2>
                                {category.name}
                            </h2>
                            <textarea
                                ref={category.id === activeCategory ? activeTextAreaRef : null}
                                key={category.id}
                                value={textAreas[category.id] || ''}
                                placeholder={"Element 1\nElement 2"}
                                onChange={(e) => handleTextAreaChange(category.id, e.target.value)}
                            />
                        </div>
                    );
                })}

                <div className="bottom-actions">
                    <button className={"add " + (totalCounters === 0 ? 'disabled' : '')} onClick={handleSubmit}>
                        <i className={"fa fa-plus"}></i>
                        {totalCounters !== 0 ? <div>{totalCounters} élément{totalCounters === 1 ? '' : 's'}</div> : ''}
                    </button>
                </div>
            </div>
        </div>
    );
}
