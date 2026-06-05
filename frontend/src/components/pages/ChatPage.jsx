import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import BlurText from '../../ui/BlurText';
import { FaComments, FaPaperclip, FaCamera, FaSmile, FaPaperPlane, FaEllipsisV, FaInfoCircle } from 'react-icons/fa';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const messagesEndRef = useRef(null);
  const location = useLocation();

  const userId = user.id || user._id || null;
  const queryOrderId = new URLSearchParams(location.search).get('orderId');

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userId) return;

      const response = await fetch(`http://localhost:5000/api/orders/customer/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        console.error('Error fetching customer orders:', data.message || data.error);
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error);
    }
  }, [userId]);

  const loadMessages = useCallback(async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !orderId) return;

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages || []);
        setSelectedOrder(data.order);
      } else {
        console.error('Error loading messages:', data.message || data.error);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId, fetchOrders]);

  useEffect(() => {
    if (queryOrderId) {
      setSelectedOrderId(queryOrderId);
    }
  }, [queryOrderId]);

  useEffect(() => {
    if (!selectedOrderId && orders.length) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  useEffect(() => {
    if (selectedOrderId) {
      loadMessages(selectedOrderId);
    } else {
      setMessages([]);
      setSelectedOrder(null);
    }
  }, [selectedOrderId, loadMessages]);

  useEffect(() => {
    const interval = selectedOrderId ? setInterval(() => loadMessages(selectedOrderId), 4000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedOrderId, loadMessages]);

  useEffect(() => {
    if (selectedOrderId) {
      const order = orders.find((item) => item.id === selectedOrderId);
      setSelectedOrder(order || null);
    }
  }, [selectedOrderId, orders]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectOrder = (order) => {
    setSelectedOrderId(order.id);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedOrderId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${selectedOrderId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: messageInput.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages || []);
        setMessageInput('');
        fetchOrders();
      } else {
        console.error('Error sending message:', data.message || data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleQuickReply = (reply) => {
    setMessageInput(reply);
  };

  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case 'unread':
        return order.unread > 0;
      case 'order-linked':
        return Boolean(order.id);
      default:
        return true;
    }
  });

  const quickReplies = [
    'When will my order be ready?',
    'Can I make changes to my order?',
    'What are your business hours?',
    'Thank you for the update!',
  ];

  const getMessageClass = (sender) => {
    return sender === 'customer' ? styles.sent : styles.received;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <BlurText text={`Chat with Tailors, ${user.name || 'Customer'}!`} delay={150} className={styles.heading} />
        <p className={styles.subtext}>
          Communicate directly with your tailors for seamless service.
        </p>
      </header>

      <div className={styles.chatContainer}>
        <div className={styles.chatSidebar}>
          <div className={styles.chatTabs}>
            <button className={`${styles.chatTab} ${activeTab === 'all' ? styles.active : ''}`} onClick={() => setActiveTab('all')}>
              All Chats
            </button>
            <button className={`${styles.chatTab} ${activeTab === 'tailor' ? styles.active : ''}`} onClick={() => setActiveTab('tailor')}>
              Tailor Chats
            </button>
            <button className={`${styles.chatTab} ${activeTab === 'unread' ? styles.active : ''}`} onClick={() => setActiveTab('unread')}>
              Unread Messages
            </button>
            <button className={`${styles.chatTab} ${activeTab === 'order-linked' ? styles.active : ''}`} onClick={() => setActiveTab('order-linked')}>
              Order-Linked Chats
            </button>
          </div>
          <div className={styles.chatList}>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`${styles.chatItem} ${selectedOrderId === order.id ? styles.active : ''}`}
                onClick={() => handleSelectOrder(order)}
              >
                <div className={styles.chatItemHeader}>
                  <div className={styles.chatItemAvatar}>
                    {order.tailor.charAt(0)}
                    <div className={`${styles.onlineIndicator} ${order.unread > 0 ? styles.online : styles.offline}`} />
                  </div>
                  <div className={styles.chatItemName}>{order.tailor}</div>
                  <div className={styles.chatItemOrderId}>{order.id.slice(-6).toUpperCase()}</div>
                </div>
                <div className={styles.chatItemLastMessage}>{order.lastMessage}</div>
                <div className={styles.chatItemTime}>{order.date}</div>
                {order.unread > 0 && <div className={styles.unreadBadge}>{order.unread}</div>}
              </div>
            ))}
            {!filteredOrders.length && <div className={styles.emptyState}>No chats match this filter.</div>}
          </div>
        </div>

        <div className={styles.chatWindow}>
          {selectedOrder ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderAvatar}>{selectedOrder.tailor.charAt(0)}</div>
                <div className={styles.chatHeaderInfo}>
                  <div className={styles.chatHeaderName}>{selectedOrder.tailor}</div>
                  <div className={styles.chatHeaderStatus}>{selectedOrder.status}</div>
                  <div className={styles.chatHeaderOrderId}>Order: {selectedOrder.id.slice(-6).toUpperCase()}</div>
                </div>
                <FaEllipsisV className={styles.chatHeaderOptions} />
              </div>

              <div className={styles.messagesArea}>
                {messages.length ? (
                  messages.map((message, index) => (
                    <div key={`${message.timestamp}-${index}`} className={`${styles.message} ${getMessageClass(message.sender)}`}>
                      <div className={styles.messageText}>{message.text}</div>
                      <div className={styles.messageTime}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <FaComments className={styles.emptyStateIcon} />
                    <div className={styles.emptyStateText}>No messages yet.</div>
                    <div className={styles.emptyStateSubtext}>Send the first message to start the conversation.</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.inputArea}>
                <div className={styles.quickReplies}>
                  {quickReplies.map((reply, index) => (
                    <button key={index} className={styles.quickReplyButton} onClick={() => handleQuickReply(reply)}>
                      {reply}
                    </button>
                  ))}
                </div>
                <div className={styles.inputContainer}>
                  <button className={styles.attachButton}>
                    <FaPaperclip />
                  </button>
                  <button className={styles.cameraButton}>
                    <FaCamera />
                  </button>
                  <textarea
                    className={styles.inputBox}
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  />
                  <button className={styles.emojiButton}>
                    <FaSmile />
                  </button>
                  <button className={styles.sendButton} onClick={handleSendMessage}>
                    <FaPaperPlane />
                  </button>
                </div>
              </div>

              <button className={styles.orderDetailsButton} onClick={() => setShowOrderDetails(true)}>
                <FaInfoCircle /> Order Details
              </button>
            </>
          ) : (
            <div className={styles.emptyState}>
              <FaComments className={styles.emptyStateIcon} />
              <div className={styles.emptyStateText}>Select a chat to start messaging</div>
              <div className={styles.emptyStateSubtext}>Choose an order from the sidebar</div>
            </div>
          )}
        </div>
      </div>

      {showOrderDetails && selectedOrder && (
        <div className={styles.orderDetailsModal} onClick={() => setShowOrderDetails(false)}>
          <div className={styles.orderDetailsContent} onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Tailor:</strong> {selectedOrder.tailor}</p>
            <p><strong>Service:</strong> {selectedOrder.service}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            {selectedOrder.description && <p><strong>Description:</strong> {selectedOrder.description}</p>}
            <button className={styles.closeModalButton} onClick={() => setShowOrderDetails(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className={styles.safetyGuidelines}>
        Remember to follow our safety guidelines: Never share personal information, avoid meeting in person, and report suspicious behavior.
      </div>

      <button className={styles.chatSupportShortcut} title="Contact Support">
        <FaComments />
      </button>
    </div>
  );
};

export default ChatPage;
