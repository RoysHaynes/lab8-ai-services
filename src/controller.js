/**
 * ChatController
 * ---------------
 * The Controller component of the MVC (Model-View-Controller) architecture.
 *
 * Responsible for handling all user interactions and connecting the Model and View.
 * The Controller listens for UI events (form submissions, button clicks) from the View,
 * updates the Model accordingly, and lets the View automatically re-render through
 * the observer pattern.
 *
 * The Controller never manipulates the DOM directly or stores data itself.
 *
 * @class ChatController
 */
import { getBotResponse } from "./eliza.js";

const GROQ_KEY_STORAGE = "groq_Key";
const PROVIDER_KEY = "chat_provider";

export class ChatController {
    /**
     * Creates an instance of ChatController and sets up event listeners.
     *
     * @constructor
     * @param {Object} model - The ChatModel instance that manages chat data.
     * @param {Object} view - The ChatView instance that handles UI rendering.
     *
     * @property {Object} model - Reference to the ChatModel used for CRUD operations.
     * @property {Object} view - Reference to the ChatView for UI updates and event hooks.
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.providerSelect = document.getElementById("provider-select");

        this.provider = localStorage.getItem(PROVIDER_KEY) || (this.providerSelect?.value || "eliza");
        if (this.providerSelect) this.providerSelect.value = this.provider;

        this.view.init(this.model);

        if (this.providerSelect) {
            this.providerSelect.addEventListener("change", () => {
                this.provider = this.providerSelect.value;
                localStorage.setItem(PROVIDER_KEY, this.provider);
            });
        }

        /**
         * Handles message sending from the input form.
         *  - Prevents page reload
         *  - Adds user message to the model
         *  - Clears input
         *  - Generates a bot response using Eliza logic
         */
        this.view.form.addEventListener("submit", (e) => {
            e.preventDefault();

            const text = this.view.input.value.trim();
            if (!text) return;


            this.model.addMessage(text, true);


            this.view.input.value = "";


            if (this.provider === "groq") {
                this.getGroqReply(text).then((reply) => {
                    this.model.addMessage(reply, false);
                }).catch((err) => {
                    this.model.addMessage("(AI error) " + (err?.message || String(err)), false);
                });
            } else {
                const reply = getBotResponse(text);
                this.model.addMessage(reply, false);
            }
        });

        /**
         * Handles clearing all chat messages.
         * Displays a confirmation dialog before calling Model.clearMessages().
         */
        this.view.clearBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear all messages?")) {
                this.model.clearMessages();
            }
        });

        /**
         * Exports chat history as a JSON file.
         * Converts model data into a downloadable Blob.
         */
        this.view.exportBtn.addEventListener("click", () => {
            const data = this.model.exportChat();
            const blob = new Blob([data], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "chat_export.json";
            a.click();
        });

        /**
         * Imports chat history from a selected JSON file.
         * Validates the data format before passing it to the Model.
         */
        this.view.importBtn.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        this.model.importChat(reader.result);
                    } catch {
                        alert("Invalid file format!");
                    }
                };
                reader.readAsText(file);
            };

            input.click();
        });

        /**
         * Handles edit and delete actions on user messages within the chat body.
         * Uses event delegation to handle all dynamically created message buttons.
         *
         * Behavior:
         * - **Delete:** Confirms and removes a selected message.
         * - **Edit:** Prompts for new text, updates the message, deletes the prior AI reply,
         *   and triggers a new AI response from the active provider.
         *
         * @event click
         * @listens ChatView.chatBody
         * @async
         * @param {MouseEvent} e - The event triggered by clicking an edit or delete button.
         */
        this.view.chatBody.addEventListener("click", async (e) => {
            const id = e.target.dataset.messageId;
            const action = e.target.dataset.action;
            if (!id || !action) return;

            if (action === "delete") {
                if (confirm("Delete this message?")) {
                    this.model.deleteMessage(id);
                }
            }

            if (action === "edit") {
                const newText = prompt("Edit your message:");
                if (newText) {
                    this.model.updateMessage(id, newText);
                    try {
                        if (this.provider === "groq") {
                            const reply = await this.getGroqReply(newText);
                            this.model.addMessage(reply, false);
                        } else {
                            const reply = getBotResponse(newText);
                            this.model.addMessage(reply, false);
                        }
                    } catch (err) {
                        this.model.addMessage("(AI error) " + (err?.message || String(err)), false);
                    }
                }
            }
        });
    }

    /**
     * Sends a user message to the Groq Cloud API and retrieves a generated response.
     *
     * Prompts the user for their Groq API key if it’s not found in `localStorage`.
     * Uses OpenAI-compatible JSON schema with the `llama-3.3-70b-versatile` model.
     *
     * Security:
     * - The key is stored locally (`localStorage`) under `"groq_Key"`.
     * - Never logged, committed, or transmitted beyond the API call.
     *
     * @async
     * @function getGroqReply
     * @param {string} userText - The user’s message to send to the Groq model.
     * @returns {Promise<string>} The AI-generated text reply, or "(no reply)" if empty.
     * @throws {Error} If the user declines to enter a key or the network request fails.
     */
    getGroqReply(userText) {
        const endpoint = "https://api.groq.com/openai/v1/chat/completions";

        let api_key = localStorage.getItem(GROQ_KEY_STORAGE);
        if (!api_key) {
            api_key = prompt("Enter Groq key:");
            if (api_key) {
                localStorage.setItem(GROQ_KEY_STORAGE, api_key);
            } else {
                return Promise.reject(new Error("Please enter Groq key"));
            }
        }

        return fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + api_key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: userText }]
            })
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                return (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
                    ? data.choices[0].message.content.trim()
                    : "(no reply)";
            });
    }
}
