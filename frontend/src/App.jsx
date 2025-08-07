// Import required hooks and libraries
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './index.css'; // Custom CSS for styling

function ChatBot() {
  // State for prompt input
  const [prompt, setPrompt] = useState("");

  // State for loading animation
  const [loading, setLoading] = useState(false);

  // State to store all messages (user, bot, and error)
  const [messages, setMessages] = useState([]);

  // Reference to scroll to the latest message
  const messagesEndRef = useRef(null);

  // Automatically scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send user prompt to the backend and update messages
  const sendPrompt = async () => {
    if (!prompt.trim()) {
      // Display warning if prompt is empty
      setMessages(prev => [...prev, { type: "error", text: "⚠️ Please enter a prompt." }]);
      return;
    }

    // Add user's message to chat history
    setMessages(prev => [...prev, { type: "user", text: prompt }]);
    setPrompt(""); // Clear input box

    try {
      setLoading(true); // Start loading

      // Send prompt to backend (adjust URL if hosted online)
      const res = await axios.post("http://localhost:5000/generate", { prompt });

      // Store bot's response or fallback message
      const botReply = res.data?.reply || "🤖 No reply received.";
      setMessages(prev => [...prev, { type: "bot", text: botReply }]);

    } catch (err) {
      // Handle errors gracefully
      setMessages(prev => [...prev, {
        type: "error",
        text: "❌ Error: " + (err.response?.data?.error || err.message)
      }]);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle Enter key press to send prompt (Shift+Enter allows newline)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  return (
    <div className="hero is-fullheight has-background-grey-darker">
      <div className="hero-body">
        <div className="container">
          <div className="box has-background-grey-dark has-text-light">
            
            {/* Chat Header */}
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  <h1 className="title has-text-light">
                    <span className="icon-text">
                      <span className="icon">
                        <i className="fas fa-robot"></i>
                      </span>
                      <span>Gemino</span>
                    </span>
                  </h1>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <span className="tag is-primary is-light">
                    <span className="icon">
                      <i className="fas fa-bolt"></i>
                    </span>
                    <span>Powered by Google</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="chat-container">
              {/* Show empty state when there are no messages */}
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <span className="icon is-large">
                    <i className="fas fa-comments fa-2x"></i>
                  </span>
                  <p>Start a conversation with Gemino</p>
                </div>
              ) : (
                // Render all messages (user, bot, error)
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message-wrapper ${
                      msg.type === "user" ? "align-right" : "align-left"
                    }`}
                  >
                    <div
                      className={`message animate__animated ${
                        msg.type === "user"
                          ? "animate__fadeInRight"
                          : msg.type === "bot"
                          ? "animate__fadeInLeft"
                          : "animate__shakeX"
                      } ${msg.type === "user" ? "is-primary" : msg.type === "bot" ? "is-info" : "is-danger"}`}
                    >
                      {/* Header (User / Bot / Error) */}
                      <div className="message-header">
                        {msg.type === "user" ? "You" : msg.type === "bot" ? "Gemini AI" : "Error"}
                      </div>

                      {/* Message Content */}
                      <div className="message-body">
                        {/* Split code blocks (```code```) and text */}
                        {msg.text.split(/```([\s\S]*?)```/g).map((block, i) =>
                          i % 2 === 1 ? (
                            // Code Block
                            <pre key={i} className="code-block">
                              <code>{block.trim()}</code>
                            </pre>
                          ) : (
                            // Regular Text
                            block.split("\n").map((line, j) => <p key={`${i}-${j}`}>{line}</p>)
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* NEW RESPONSIVE THINKING ANIMATION - ONLY THIS SECTION CHANGED */}
              {loading && (
                <div className="message-wrapper align-left">
                  <div className="message is-info animate__animated animate__fadeInLeft">
                    <div className="message-header">
                      Gemini AI
                    </div>
                    <div className="message-body thinking-message">
                      <div className="responsive-thinking">
                        <div className="pulse-dot"></div>
                        <div className="thinking-text">Processing your request</div>
                      </div>
                      <div className="wave-animation">
                        {[...Array(window.innerWidth < 768 ? 3 : 5)].map((_, i) => (
                          <div 
                            key={i} 
                            className="wave-bar"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="field">
              <div className="control has-icons-right">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="textarea has-background-black-lighter"
                  rows="3"
                  placeholder="Type your message here..."
                  disabled={loading}
                />
                {/* Right-side Icon (loading or send icon) */}
                {loading ? (
                  <span className="icon is-small is-right">
                    <i className="fas fa-spinner fa-pulse"></i>
                  </span>
                ) : (
                  <span className="icon is-small is-right">
                    <i className="fas fa-paper-plane"></i>
                  </span>
                )}
              </div>
            </div>

            {/* Control Buttons (Clear + Send) */}
            <div className="field is-grouped is-grouped-right">
              {/* Clear Chat */}
              {/* Clear Chat */}
<div className="control">
  <button
    onClick={() => {
      if (messages.length === 0 || loading) return;
      document.querySelectorAll('.message').forEach((msg, i) => {
        msg.style.setProperty('--random-x', Math.random() > 0.5 ? 1 : -1);
        msg.style.animationDelay = `${i * 0.05}s`;
      });
      document.querySelector('.chat-container').classList.add('clearing-chat');
      setTimeout(() => {
        setMessages([]);
        document.querySelector('.chat-container').classList.remove('clearing-chat');
      }, 800);
    }}
    className="button is-light is-small clear-btn"
    disabled={loading || messages.length === 0}
  >
    <span className="icon">
      <i className="fas fa-trash"></i>
    </span>
    <span>Clear Chat</span>
  </button>
</div>

              {/* Send Message */}
              <div className="control">
                <button
                  onClick={sendPrompt}
                  disabled={loading}
                  className={`button is-primary ${loading ? 'is-loading' : ''}`}
                >
                  <span className="icon">
                    <i className="fas fa-paper-plane"></i>
                  </span>
                  <span>{loading ? "Thinking..." : "Send"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="hero-foot">
        <p className="has-text-grey-light">
          <small>Powered by React & Bulma</small>
        </p>
      </div>
    </div>
  );
}

export default ChatBot;