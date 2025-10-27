/**
 * ChatModel
 * ----------
 * The Model component of the MVC architecture.
 *
 * Handles all data-related logic for the chat application, including message
 * storage, CRUD operations (Create, Read, Update, Delete), and persistence
 * using `localStorage`. The Model does not interact with the DOM directly.
 * Instead, it uses the observer pattern to notify the View when data changes.
 *
 * @class ChatModel
 */
export class ChatModel {

    /**
     * Constructs the ChatModel.
     * Loads existing messages from localStorage and initializes the observer list.
     *
     * @constructor
     * @property {Array<Object>} messages - The array of chat message objects.
     * @property {Function[]} observers - List of callback functions to notify when data changes.
     */
    constructor() {
        this.messages = this.loadMessages();
        this.observers = [];
    }

    /**
     * Registers an observer callback function.
     * Used by the View to listen for data changes.
     *
     * @param {Function} callback - Function to call whenever the model updates.
     * @returns {void}
     */
    addObserver(callback) {
        this.observers.push(callback);
    }

    /**
     * Calls all registered observer callbacks to trigger UI updates.
     *
     * @returns {void}
     */
    notifyObservers() {
        this.observers.forEach(callback => callback());
    }

    /**
     * Adds a new message to the chat.
     * Also saves to localStorage and notifies observers to re-render.
     *
     * @param {string} text - The message text.
     * @param {boolean} isUser - True if the message is from the user, false if from the bot.
     * @returns {void}
     */
    addMessage(text, isUser) {
        const message = {
            id: Date.now().toString(),
            text: text,
            isUser: isUser,
            timestamp: Date.now().toString(),
            edited: false
        };
        this.messages.push(message);
        this.saveMessages();
        this.notifyObservers();
    }

    /**
     * Retrieves all messages from memory.
     *
     * @returns {Array<Object>} A shallow copy of the messages array.
     */
    getMessages() {
        return [...this.messages];
    }

    /**
     * Updates an existing user message by ID.
     * Marks the message as edited and saves the change.
     *
     * @param {string} id - The unique ID of the message to update.
     * @param {string} newText - The updated message text.
     * @returns {void}
     */
    updateMessage(id, newText) {
        const message = this.messages.find(msg => msg.id === id);
        if (message && message.isUser) {
            message.text = newText;
            message.edited = true;
            this.saveMessages();
            this.notifyObservers();
        }
    }

    /**
     * Deletes a single message by its ID.
     *
     * @param {string} id - The ID of the message to remove.
     * @returns {void}
     */
    deleteMessage(id) {
        this.messages = this.messages.filter(msg => msg.id !== id);
        this.saveMessages();
        this.notifyObservers();
    }

    /**
     * Clears all chat messages from memory and localStorage.
     *
     * @returns {void}
     */
    clearMessages() {
        this.messages = [];
        this.saveMessages();
        this.notifyObservers();
    }

    /**
     * Exports chat history as a formatted JSON string.
     *
     * @returns {string} JSON representation of all stored messages.
     */
    exportChat() {
        return JSON.stringify(this.messages, null, 2);
    }

    /**
     * Imports chat history from a JSON string.
     * Validates format before saving and re-rendering.
     *
     * @param {string} jsonData - JSON string of message objects.
     * @throws {Error} If JSON is invalid or incorrectly formatted.
     * @returns {void}
     */
    importChat(jsonData) {
        try {
            const messages = JSON.parse(jsonData);
            if (!Array.isArray(messages) || !messages.every(msg => msg.id && msg.text && typeof msg.isUser === 'boolean')) {
                throw new Error('Invalid chat data format');
            }
            this.messages = messages;
            this.saveMessages();
            this.notifyObservers();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Saves the current message list to localStorage.
     *
     * @returns {void}
     */
    saveMessages() {
        try {
            localStorage.setItem('chatMessages', JSON.stringify(this.messages));
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Loads messages from localStorage into memory.
     * Returns an empty array if no data is found or if an error occurs.
     *
     * @returns {Array<Object>} Loaded messages or an empty array.
     */
    loadMessages() {
        try {
            const data = localStorage.getItem("chatMessages");
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }


}