function parseThinkingAndFinal(text) {
  const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/gi) || [];
  const thinking = thinkMatch
    .map((match) => match.replace(/<think>|<\/think>/gi, "").trim())
    .join("\n")
    .trim();

  // ✅ Remove <think> blocks from visible text
  const visible = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  return {
    thinking: thinking || "",
    final: visible || "⁕⁕⁕",
  };
}

function appendMessage(text, sender, thinking = "") {
  const messages = document.getElementById("messages");
  if (!messages) return null;

  const msgDiv = document.createElement("div");
  msgDiv.classList.add(
    "msg",
    sender,
    "p-3",
    "rounded-lg",
    "max-w-[75%]",
    "text-sm",
    "sm:text-base",
    sender === "user" ? "bg-blue-600" : "bg-gray-200",
    sender === "user" ? "text-white" : "text-gray-800",
    sender === "user" ? "ml-auto" : "mr-auto"
  );
  msgDiv.setAttribute("role", "listitem");

  const contentDiv = document.createElement("div");
  contentDiv.textContent = text;
  contentDiv.classList.add("break-words");
  msgDiv.appendChild(contentDiv);

  if (thinking) {
    const details = document.createElement("details");
    details.classList.add("mt-2", "text-xs", "text-gray-600");

    const summary = document.createElement("summary");
    summary.textContent = "Think";
    summary.setAttribute("aria-label", "Toggle reasoning details");
    summary.classList.add(
      "cursor-pointer",
      "text-blue-600",
      "font-semibold",
      "hover:bg-blue-100",
      "rounded-full",
      "w-6",
      "h-6",
      "flex",
      "items-center",
      "justify-center"
    );

    const pre = document.createElement("pre");
    pre.textContent = thinking;
    pre.classList.add(
      "mt-2",
      "p-2",
      "bg-gray-50",
      "rounded",
      "border",
      "border-gray-200",
      "text-xs",
      "text-wrap",
      "w-auto"
    );

    details.appendChild(summary);
    details.appendChild(pre);
    msgDiv.appendChild(details);
  }

  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
  return msgDiv;
}

function updateBotMessage(
  msgDiv,
  visibleText,
  thinkingText,
  appendThinking = false
) {
  if (!msgDiv) return;

  const contentDiv = msgDiv.querySelector("div");
  if (contentDiv) {
    contentDiv.textContent = visibleText || "⁕⁕⁕";
   contentDiv.classList.add("animate-bounce");
       if (thinkingText) {
       contentDiv.classList.remove("animate-bounce");
      }
  }

  if (appendThinking) {
    let details = msgDiv.querySelector("details");
    if (thinkingText && !details) {
      details = document.createElement("details");
      details.classList.add("mt-2", "text-xs", "text-gray-600");
      const summary = document.createElement("summary");
      summary.textContent = "Think";
      summary.setAttribute("aria-label", "Toggle reasoning details");
      summary.classList.add(
        "cursor-pointer",
        "text-blue-600",
        "font-semibold",
        "hover:bg-blue-100",
        "rounded",
        "w-12",
        "h-6",
        "px-3",
        "text-[10px]",
        "border",
        "flex",
        "items-center",
        "justify-center"
      );

      const pre = document.createElement("pre");
      pre.textContent = thinkingText;
      pre.classList.add(
        "mt-2",
        "p-2",
        "bg-gray-50",
        "rounded",
        "border",
        "border-gray-200",
        "text-xs",
        "text-wrap",
        "w-auto"
      );
      details.appendChild(summary);
      details.appendChild(pre);
      msgDiv.appendChild(details);
    } else if (thinkingText && details) {
      const pre = details.querySelector("pre");
      if (pre) pre.textContent = thinkingText;
    } else if (!thinkingText && details) {
      details.remove();
    }
  }

  const messages = document.getElementById("messages");
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("input");
  const sendButton = document.getElementById("send");
  if (!input || !sendButton) return;

  const text = input.value.trim();
  if (!text) return;

  input.disabled = true;
  sendButton.disabled = true;
  input.setAttribute("aria-busy", "true");

  appendMessage(text, "user");
  input.value = "";
  const botDiv = appendMessage("⁕⁕⁕", "bot");

  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen3:0.6b",
        messages: [{ role: "user", content: text }],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const reader = response.body.getReader();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        // ✅ Final update when completely done
        const { thinking, final } = parseThinkingAndFinal(fullText);
        updateBotMessage(botDiv, final, thinking, true);
        break;
      }

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.message && data.message.content) {
            fullText += data.message.content;

            // ✅ Parse current text, but strip unfinished <think>
            let { thinking, final } = parseThinkingAndFinal(fullText);

            if (fullText.includes("</think>")) {
              // Reasoning finished → show reasoning + visible text
              updateBotMessage(botDiv, final, thinking, true);
            } else {
              // Still inside <think>, hide it → show only visible text
              const hiddenText = fullText
                .replace(/<think>[\s\S]*$/gi, "")
                .trim();
              updateBotMessage(botDiv, hiddenText, "", false);
            }
          }
        } catch (err) {
          console.error("Chunk parse error:", line, err);
        }
      }
    }

    if (!fullText) {
      updateBotMessage(botDiv, "No response received", "", false);
    }
  } catch (err) {
    console.error("API error:", err);
    updateBotMessage(botDiv, "⚠️ Error connecting to Ollama", "", false);
  } finally {
    input.disabled = false;
    sendButton.disabled = false;
    input.setAttribute("aria-busy", "false");
    input.focus();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const sendButton = document.getElementById("send");
  if (!input || !sendButton) {
    console.error("Required DOM elements not found");
    return;
  }

  sendButton.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  input.focus();
});
