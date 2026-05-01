const storage = {
    
    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getItem(key){
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    remove(key) {
        localStorage.removeItem(key);
    }
}
export default storage;