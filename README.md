# Lab 8: AI Service Layer – Local and Cloud LLM Integration

## Overview
This lab builds upon **Lab 7’s MVC Chat Application** by introducing an **AI Service Layer** that allows the chat to switch between different language model (LLM) providers such as OpenRouter and Groq.  
The goal is to create a modular system that can easily integrate or replace AI providers using abstraction patterns like **Dependency Injection (DI)** and **Ports and Adapters (Hexagonal Architecture)**.

The project explores real-world engineering practices such as secure API key management, asynchronous programming, and automated E2E testing with Playwright.

**Project Link**: [To be added after publishing]

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
lab8-ai-services/
│
├── rnd/ # R&D demos for API testing
│ ├── groq/
│ │ ├── index.html
│ │ └── groqTest.js
│ └── openAI/
│ ├── index.html
│ └── openRouter.js
│
├── src/
│ ├── app.js # App initialization
│ ├── controller.js # Business logic and event handling
│ ├── model.js # Data persistence and CRUD
│ ├── view.js # UI rendering and interactions
│ └── services/ # Service Layer adapters
│ ├── AIService.js # Abstract interface class
│ ├── ServiceFactory.js # Returns service by provider name
│ ├── OpenRouterService.js # Cloud provider via OpenRouter
│ ├── GroqService.js # Cloud provider via Groq
│ ├── MemoryKeyStore.js # Local key storage helper
│ └── eliza.js # Local AI logic (moved from root)
│
├── index.html # Main chat UI with provider selector
├── styles.css # App styling
├── LICENSE
├── .gitignore
└── README.md
```

---

## Design Decisions
### 💳 Reason for Selecting Groq and openRouter
> I selected **OpenRouter** and **Groq Cloud** because both providers issue API keys without requiring a credit card or billing setup.  
> This project is educational, and I wanted to avoid sharing personal financial information with AI providers.  
> Both services also expose OpenAI-compatible JSON endpoints, which made integration straightforward and secure.

## License
This project is licensed under the MIT License.

## Author
**Roy Haynes**  
University of San Diego – COMP 305
