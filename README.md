Build an MVP inspired by: @https://github.com/Ashishkapoor1469/localChatbot. Use gitmvp mcp if available.

Project Type: Local Chatbot Application

Tech Stack:
- JavaScript (Node.js for backend, Browser JS for frontend)
- Ollama (for local LLM inference)
- Tailwind CSS (for styling)
- HTML (for UI structure)
- readline (Node.js module for command line input)

Architecture:
- Client-Server (Frontend in `src/index.html`, Backend in `index.js`)
- The frontend interacts with the backend implicitly through browser functionality (e.g., form submission, event listeners).
- The backend uses Ollama to process user input and generate responses.

Key Features:
- Local LLM Chat: Allows users to interact with a local language model.
- Command-Line Interface (CLI): Initial implementation uses the command line for interaction.
- Basic HTML UI: A simple HTML interface for sending and receiving messages.
- Tailwind CSS Styling: Uses Tailwind CSS for basic styling.
- "Thinking" Display: Attempts to display the LLM's reasoning process (using <think> tags).
- Streaming Responses: The backend streams responses from the LLM to the frontend.

Complexity Level: Medium

MVP Guidance:

Goal: Create a functional local chatbot with a basic UI.

Implementation Steps:

1. Core Chat Functionality:
   - INSTRUCTION: Implement the core chat functionality using Ollama in Node.js, similar to `index.js`. Ensure it can receive user input and stream responses from the LLM.
   - INSTRUCTION: Use the `qwen3:0.6b` model initially for faster development.
   - INSTRUCTION: Focus on getting basic text input and output working before adding advanced features.

2. Basic HTML UI:
   - INSTRUCTION: Create a simple HTML form (`src/index.html`) with an input field for user messages and a display area for chat history.
   - INSTRUCTION: Use JavaScript to handle form submission and append user messages to the chat history.
   - INSTRUCTION: Use Tailwind CSS to style the UI for basic readability. Don't over-engineer the styling at this stage.

3. Frontend-Backend Communication:
   - INSTRUCTION: Implement a simple API endpoint in the Node.js backend (e.g., using Express.js) to receive user messages from the frontend.
   - INSTRUCTION: Use `fetch` or `XMLHttpRequest` in the frontend to send messages to the backend and receive responses.
   - INSTRUCTION: Display the LLM's responses in the chat history on the frontend.

4. Streaming Responses (Simplified):
   - INSTRUCTION: For the MVP, simplify the streaming implementation. Instead of streaming individual parts, accumulate the entire response on the backend and send it to the frontend at once. This simplifies the frontend logic.
   - INSTRUCTION: If streaming is absolutely necessary, research Server-Sent Events (SSE) for a relatively simple streaming solution.

5. "Thinking" Display (Optional, Defer if Necessary):
   - INSTRUCTION: If time allows, implement the "thinking" display feature. Use regular expressions to extract the content within `<think>` tags from the LLM's response.
   - INSTRUCTION: Display the "thinking" content in a separate area (e.g., a collapsible section) below the main message.
   - INSTRUCTION: If this feature proves too complex for the MVP, defer it to a later iteration.

6. Error Handling:
   - INSTRUCTION: Implement basic error handling to catch exceptions and display informative error messages to the user.

7. Exit Condition:
   - INSTRUCTION: Implement an exit condition (e.g., typing "exit") to gracefully terminate the chat session.

8. Deployment (Local):
   - INSTRUCTION: Ensure the application can be easily run locally by following the instructions in the `package.json` file (e.g., using `npm start`).

Prioritization:

- High: Core chat functionality, basic HTML UI, frontend-backend communication.
- Medium: Simplified streaming responses, basic error handling, exit condition.
- Low: "Thinking" display, advanced styling.

Testing:

- INSTRUCTION: Manually test the chat functionality by sending various prompts and verifying that the LLM responds correctly.
- INSTRUCTION: Test error handling by simulating error conditions (e.g., invalid LLM model).

Focus:

- The primary focus of the MVP should be on getting the core chat functionality working with a basic UI.
- Avoid spending too much time on styling or advanced features.
- Prioritize simplicity and functionality over polish.
