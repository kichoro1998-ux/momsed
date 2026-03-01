import { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";
import { notificationAPI } from "../utils/api";
import "./Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll();
      setNotifications(response.data);
      
      // Count unread
      const response2 = await notificationAPI.getUnreadCount();
      setUnreadCount(response2.data.unread_count);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      fetchNotifications(); // Refresh count
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'new_order':
        return <FaBell className="text-primary" />;
      case 'order_approved':
        return <FaCheckCircle className="text-success" />;
      case 'order_rejected':
        return <FaTimesCircle className="text-danger" />;
      case 'order_out_of_stock':
        return <FaExclamationCircle className="text-warning" />;
      case 'order_delivered':
        return <FaCheckCircle className="text-success" />;
      default:
        return <FaBell className="text-info" />;
    }
  };

  const getNotificationBg = (type) => {
    switch(type) {
      case 'new_order':
        return 'bg-light-primary';
      case 'order_approved':
        return 'bg-light-success';
      case 'order_rejected':
        return 'bg-light-danger';
      case 'order_out_of_stock':
        return 'bg-light-warning';
      case 'order_delivered':
        return 'bg-light-success';
      default:
        return 'bg-light-info';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notifications-container">
      <div className="notification-bell" onClick={() => setShowDropdown(!showDropdown)}>
        <FaBell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h5>Notifications</h5>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button
                  className="btn btn-sm btn-link"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
              <button
                className="notification-close"
                onClick={() => setShowDropdown(false)}
                aria-label="Close notifications"
                type="button"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {loading && <p className="text-center py-3">Loading...</p>}
            
            {!loading && notifications.length === 0 && (
              <p className="text-center py-3 text-muted">No notifications yet</p>
            )}

            {!loading && notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${notification.is_read ? 'read' : 'unread'} ${getNotificationBg(notification.type)}`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <small className="notification-time">{formatDate(notification.created_at)}</small>
                </div>
                {!notification.is_read && <div className="unread-indicator"></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
