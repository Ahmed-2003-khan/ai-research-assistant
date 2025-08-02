import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "How can I help you?" }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let assistantMessage = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      assistantMessage += chunk.replace("data: ", "").trim();
      setMessages((msgs) => [...newMessages, { role: "assistant", content: assistantMessage }]);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      {messages.map((msg, idx) => (
        <div key={idx} className={`p-3 rounded-md ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
          <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
        </div>
      ))}
      <input
        className="border p-2 w-full rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
    </div>
  );
}

export default App;
