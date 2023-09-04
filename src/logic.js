const logic = {
    getTabByTodo: (todo) => {
        if (!todo.checked && !todo.archived) {
            return 'pending';
        } else if (todo.checked && !todo.archived) {
            return 'checked'
        } else if (todo.archived) {
            return 'archived'
        }
    }
};

export default logic;



