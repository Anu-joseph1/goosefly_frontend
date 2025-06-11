import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import './ChatPage.css';

const ChatPage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get recipient data from location state or fetch from API
    if (location.state?.recipient) {
      setRecipient(location.state.recipient);
      setLoading(false);
    } else {
      // Fallback: Fetch recipient data if not passed in state
      fetch(`http://172.16.11.171:8000/by_id?user_id=${employeeId}`)
        .then(response => response.json())
        .then(data => {
          setRecipient(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching recipient:", error);
          setLoading(false);
        });
    }

    // TODO: Fetch existing messages from API
    const dummyMessages = [
      { id: 1, sender: employeeId, text: "Hi there!", timestamp: new Date().toISOString() },
      { id: 2, sender: 'current-user', text: "Hello! How are you?", timestamp: new Date().toISOString() }
    ];
    setMessages(dummyMessages);
  }, [employeeId, location.state]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // TODO: Send message to backend API
    const newMsg = {
      id: messages.length + 1,
      sender: 'current-user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  if (loading) {
    return <div className="loading">Loading chat...</div>;
  }

  if (!recipient) {
    return <div className="error">Could not load recipient information</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <FaArrowLeft className="back-button" onClick={() => navigate(-1)} />
        <img 
          src={recipient.profile_pic || 'default-profile.jpg'} 
          alt={recipient.name} 
          className="profile-pic"
        />
        <div className="recipient-info">
          <h3>{recipient.name}</h3>
          <p>{recipient.designation}</p>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'current-user' ? 'sent' : 'received'}`}
          >
            <p className="message-text">{message.text}</p>
            <span className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      <form className="message-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!newMessage.trim()}>
          <FaPaperPlane className="send-icon" />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;