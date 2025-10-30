/**
 * ChatView
 * --------
 * The View component of the MVC architecture.
 *
 * Responsible for rendering chat messages to the DOM and updating the interface
 * whenever the Model changes. The View does not modify data directly; it only
 * listens to Model updates and reflects them in the user interface.
 *
 * @class ChatView
 */
export class ChatView {
    /**
     * Creates an instance of ChatView and initializes DOM element references.
     *
     * @constructor
     * @property {HTMLElement} chatBody   - The container where chat messages are displayed.
     * @property {HTMLElement} messageCount - Element showing the total number of messages.
     * @property {HTMLElement} emptyState - "Start chatting" placeholder element for empty chat.
     * @property {HTMLFormElement} form   - The message input form.
     * @property {HTMLInputElement} input - The text input field for user messages.
     * @property {HTMLButtonElement} importBtn - Button that triggers JSON import.
     * @property {HTMLButtonElement} exportBtn - Button that triggers JSON export.
     * @property {HTMLButtonElement} clearBtn  - Button that clears all messages.
     * @property {Object|null} model     - Reference to the ChatModel instance.
     */
    constructor() {
        this.chatBody = document.querySelector(".chat-body");
        this.messageCount = document.querySelector("#msg-count");
        this.emptyState = document.querySelector(".start-chat");
        this.form = document.querySelector(".chat-input");
        this.input = this.form.querySelector("input");
        this.importBtn = document.querySelector("[data-import]");
        this.exportBtn = document.querySelector("[data-export]");
        this.clearBtn = document.querySelector("[data-clear]");
        this.model = null;
    }

    /**
     * Initializes the View with a reference to the Model and sets up
     * an observer so the View re-renders whenever the Model changes.
     *
     * @param {Object} model - The ChatModel instance to observe.
     * @returns {void}
     */
    init(model) {
        this.model = model;
        this.model.addObserver(() => this.render());
        this.render();
    }

    /**
     * Renders the entire chat interface:
     *  - Clears and rebuilds the chat message list
     *  - Updates the message count
     *  - Toggles the "start chat" empty state
     *  - Appends each message with proper styling and edit/delete buttons
     *
     * @returns {void}
     */
    render() {
        this.chatBody.innerHTML = "";

        const messages = this.model.getMessages();

        this.messageCount.textContent =
            messages.length + " message" + (messages.length !== 1 ? "s" : "");

        this.emptyState.style.display = messages.length === 0 ? "block" : "none";

        messages.forEach((message) => {
            const messageEl = document.createElement("article");

            if (message.isUser) {
                messageEl.classList.add("user-messages");
            } else {
                messageEl.classList.add("bot-messages");
            }

            messageEl.setAttribute("data-message-id", message.id);

            messageEl.innerHTML = `
                <p>${message.text}</p>
                ${message.edited ? "<small>(edited)</small>" : ""}
                ${message.isUser ? `
                    <button class="btn edit-btn" data-action="edit" data-message-id="${message.id}">Edit</button>
                    <button class="btn danger delete-btn" data-action="delete" data-message-id="${message.id}">Delete</button>
                ` : ""}
            `;

            this.chatBody.appendChild(messageEl);
        });
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }
}