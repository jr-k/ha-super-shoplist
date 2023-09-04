import React, { useState } from 'react';
import './Footer.css';
import AddItemModal from "./AddItemModal";

function Footer({ addTodos, tab }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddItems = (items) => {
        addTodos(items);
    };

    <button onClick={() => setModalOpen(true)}>Ajouter un élément</button>

    return (
        <>
            <AddItemModal
                tab={tab}
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                addItems={handleAddItems}
            />
            <footer>
                <button onClick={() => setModalOpen(true)}>
                    <i className="fa fa-plus"></i>
                </button>
            </footer>
        </>
    );
}

export default Footer;
