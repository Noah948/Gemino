import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './index.css';

function ChatBot() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendPrompt = async () => {
    if (!prompt.trim()) {
      setMessages(prev => [...prev, { type: "error", text: "⚠️ Please enter a prompt." }]);
      return;
    }

    setMessages(prev => [...prev, { type: "user", text: prompt }]);
    setPrompt("");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/generate", { prompt });
      const botReply = res.data?.reply || "🤖 No reply received.";
      setMessages(prev => [...prev, { type: "bot", text: botReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { type: "error", text: "❌ Error: " + (err.response?.data?.error || err.message) }]);
    } finally {
      setLoading(false);
    }
  };

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
            {/* Header */}
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

            {/* Chat Container */}
            <div className="chat-container">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <span className="icon is-large">
                    <i className="fas fa-comments fa-2x"></i>
                  </span>
                  <p>Start a conversation with Gemini AI</p>
                </div>
              ) : (
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
                      <div className="message-header">
                        {msg.type === "user" ? "You" : msg.type === "bot" ? "Gemini AI" : "Error"}
                      </div>
                      <div className="message-body">
                        {msg.text.split(/```([\s\S]*?)```/g).map((block, i) =>
                          i % 2 === 1 ? (
                            <pre key={i} className="code-block">
                              <code>{block.trim()}</code>
                            </pre>
                          ) : (
                            block.split("\n").map((line, j) => <p key={`${i}-${j}`}>{line}</p>)
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
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

            {/* Buttons */}
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button
                  onClick={() => setMessages([])}
                  className="button is-light is-small"
                  disabled={loading || messages.length === 0}
                >
                  <span className="icon">
                    <i className="fas fa-trash"></i>
                  </span>
                  <span>Clear Chat</span>
                </button>
              </div>
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
          <small>Powered by React & Bulma | Gemini AI Chat Interface</small>
        </p>
      </div>
    </div>
  );
}

export default ChatBot;
