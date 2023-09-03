import React, { useState } from 'react';
import './Footer.css';
import AddItemModal from "./AddItemModal";

function Footer({ setTodos, todos }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddItems = (items) => {
        setTodos({...items, ...todos});
    };

    <button onClick={() => setModalOpen(true)}>Ajouter un élément</button>

    return (
        <>
            <AddItemModal
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
