# Lab 8: AI Service Layer – Local and Cloud LLM Integration

## Overview
This lab builds upon **Lab 7’s MVC Chat Application** by introducing an **AI Service Layer** that allows the chat to switch between different language model (LLM) providers such as OpenRouter and Groq.  
The goal is to create a modular system that can easily integrate or replace AI providers using abstraction patterns like **Dependency Injection (DI)** and **Ports and Adapters (Hexagonal Architecture)**.

The project explores real-world engineering practices such as secure API key management, asynchronous programming, and automated E2E testing with Playwright.

**Project Link**: https://royshaynes.github.io/lab8-ai-services/
## Setup Instructions 

```bash
# 1. Clone & install
git clone https://github.com/RoysHaynes/lab8-ai-services.git
cd lab8-ai-services
npm install          # installs @playwright/test
# 4. Run a static server (Playwright uses port 5173)
npx serve -l 5173 .

# 5. Run the Playwright tests
npx playwright test
````
---

### Key Themes
- **Service Abstraction:** Isolate AI logic from MVC using a shared service interface.
- **Dependency Injection:** Allow dynamic switching between providers without changing core code.
- **API Integration:** Implement real HTTP requests to OpenRouter and Groq.
- **Security Awareness:** Manage API keys safely in-browser via prompts and `localStorage`.
- **Async Programming:** Handle AI replies with Promises and `async/await`.
- **Automated Testing:** Use Playwright to perform end-to-end chat flow tests.

---

## Project Goals
By the end of this lab, the application will:
1. Integrate an **AI Service Layer** capable of selecting between local (Eliza) and cloud (OpenRouter, Groq) AI providers.
2. Support dynamic switching through a **provider dropdown** in the UI.
3. Store API keys securely (prompt once, save temporarily).
4. Maintain existing **CRUD** and **persistence** functionality from Lab 7.
5. Demonstrate two R&D experiments (OpenRouter and Groq) with real API calls.
6. Include **Playwright tests** for both local and cloud chat modes.
7. Publish the live app link for grading.

---

## 📁 Repository Structure
```aiignore
```plaintext
lab8-ai-services/
│
├── rnd/                     # R&D demos for API testing
│   ├── groq/
│   │   ├── index.html
│   │   └── groqTest.js
│   └── openAI/
│       ├── index.html
│       └── openRouter.js
│
├── src/
│   ├── app.js               # Initializes Model, View, and Controller
│   ├── controller.js        # Core logic: Eliza + Groq integrated here
│   ├── model.js             # Handles CRUD and localStorage
│   └── view.js              # Handles rendering and UI
│
├── tests/
│   ├── eliza.spec.js        # Local AI test
│   └── groq-mock.spec.js    # Mocked Groq test for E2E validation
│
├── index.html               # Main interface with dropdown + chat input
├── styles.css               # Responsive styling
├── playwright.config.js     # Test runner setup
├── .gitignore
└── README.md
```

---

## Design Decisions
### 💳 Reason for Selecting Groq and openRouter
> I selected **OpenRouter** and **Groq Cloud** because both providers issue API keys without requiring a credit card or billing setup.  
> This project is educational, and I wanted to avoid sharing personal financial information with AI providers.  
> Both services also expose OpenAI-compatible JSON endpoints, which made integration straightforward and secure.

---
## 🤖 AI Service Comparison

| Provider | Endpoint | Model | Free Access | Speed | API Key Required | Notes |
|-----------|-----------|--------|--------------|--------|------------------|--------|
| **Eliza (Local)** | Local JavaScript | Pattern-based logic | ✅ Yes | ⚡ Instant | ❌ No | Offline, deterministic chatbot |
| **Groq Cloud** | `https://api.groq.com/openai/v1/chat/completions` | `llama-3.3-70b-versatile` | ✅ Yes | ⚡⚡ Very fast | ✅ Yes | OpenAI-compatible JSON endpoint |
| **OpenRouter** | `https://openrouter.ai/api/v1/chat/completions` | `gpt-4o-mini` | ✅ Yes | ⚡ Fast | ✅ Yes | Supports multiple open-source models |

## Design Decisions

### Model (`src/model.js`)
- Reused from Lab 7 for CRUD operations and `localStorage` persistence.
- Handles `addMessage`, `updateMessage`, `deleteMessage`, `clearMessages`, and JSON import/export.
- Used unchanged, since AI Service logic occurs only in `controller.js`.

---

### View (`src/view.js`)
- Reused from Lab 7 with light extensions:
    - Added `provider-select` dropdown (`<select id="provider-select">`) for AI mode switching.
    - Added API key input field and “Send” button for future integrations.
    - Retained message count badge and scroll-to-bottom behavior.
- No direct DOM manipulation for AI handled here—View remains display-only.

---

### Controller (`src/controller.js`)
The Controller was **significantly enhanced** to integrate cloud AI logic while preserving the MVC pattern.
I added a new feature where the edit chat now prompts a new response.

#### 🔧 Key Additions
- **Provider Switching:**  
  Dropdown lets users toggle between `Eliza (Local)` and `Groq`.  
  The selected provider is saved to `localStorage` under `chat_provider`.
- **Groq Integration:**  
  When Groq is active, user messages are sent to  
  `https://api.groq.com/openai/v1/chat/completions`  
  with the model `llama-3.3-70b-versatile`.
- **API Key Management:**  
  Prompts the user for their Groq key once, then saves it in `localStorage` as `groq_Key`.  
  No key is ever committed to Git.
- **Message Editing Re-Prompt:**  
  When a user edits a message:
    1. The old bot reply immediately following that message is deleted.
    2. The edited message triggers a fresh AI response (Groq or Eliza).
    3. The conversation updates dynamically without a reload.
- **Async/Await:**  
  Network calls to Groq’s endpoint use `fetch()` wrapped in async functions for clarity.
- **Error Handling:**  
  If the Groq API fails, an `(AI error)` placeholder is displayed in chat.

## 🔐 Privacy and Cost Discussion

This project was intentionally designed to avoid collecting or storing user data, credentials, or API keys on any remote server.

- **Local-Only Storage:**  
  API keys entered by the user are stored **only in `localStorage`** and never leave their device.  
  This approach satisfies the lab’s goal of demonstrating safe key management in a browser environment.

- **No Sensitive Commits:**  
  The repository contains no `.env` files or hardcoded credentials.  
  `.gitignore` ensures any test configuration files or environment variables are ignored by Git.

- **Zero-Cost Providers:**  
  Both **Groq** and **OpenRouter** issue free developer API keys and do not require credit cards.  
  This makes them ideal for student or educational projects where cost and data security are concerns.

- **Security Awareness:**  
  In a production setting, API calls should be routed through a secure backend (e.g., Node or Flask) that reads keys from environment variables (`process.env`).  
  However, for this educational project, the browser-based key prompt fulfills all learning and safety requirements.

- **No External Tracking:**  
  The application sends only minimal request data (user messages) and receives model-generated text.  
  No personal data, cookies, or analytics are transmitted or stored.

## License
This project is licensed under the MIT License.

## Author
**Roy Haynes**  
University of San Diego – COMP 305
