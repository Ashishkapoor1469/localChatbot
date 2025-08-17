import Ollama from "ollama";
import readline from "readline";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout, 
});         

async function chatLoop() {
  while (true) {
    const question = await new Promise((resolve) =>
      rl.question("You: ", resolve) 
    );

    if (question.trim().toLowerCase() === "exit") {
      console.log("👋 Goodbye!"); 
      rl.close();
      process.exit(0);  
    }

    const response = await Ollama.chat({
      model: "qwen3:0.6b",   // Specify the model
      messages: [{ role: "user", content: question }], // Send user message
      stream: true, // Enable streaming
    });

    process.stdout.write("Bot: "); // Print bot response prefix
    for await (const part of response) { 
      process.stdout.write(part.message?.content || "");  
    } 
    process.stdout.write("\n\n");   
  }
}

chatLoop(); 
