const admin = require('../config/firebase');

/**
 * Send a push notification to a specific user
 * @param {string} userId - The Firebase UID of the user
 * @param {string} title - The notification title
 * @param {string} body - The notification body
 * @param {Object} data - Additional data to send with the notification
 * @returns {Promise} - Resolves when the notification is sent
 */
const sendNotification = async (userId, title, body, data = {}) => {
  try {
    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      token: userId // This should be the FCM token, not the user ID
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Send a push notification to multiple users
 * @param {string[]} userIds - Array of Firebase UIDs
 * @param {string} title - The notification title
 * @param {string} body - The notification body
 * @param {Object} data - Additional data to send with the notification
 * @returns {Promise} - Resolves when the notifications are sent
 */
const sendMulticastNotification = async (userIds, title, body, data = {}) => {
  try {
    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      tokens: userIds // Array of FCM tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent multicast notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending multicast notification:', error);
    throw error;
  }
};

/**
 * Send a push notification to a topic
 * @param {string} topic - The topic to send to
 * @param {string} title - The notification title
 * @param {string} body - The notification body
 * @param {Object} data - Additional data to send with the notification
 * @returns {Promise} - Resolves when the notification is sent
 */
const sendTopicNotification = async (topic, title, body, data = {}) => {
  try {
    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      topic
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent topic notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending topic notification:', error);
    throw error;
  }
};

module.exports = {
  sendNotification,
  sendMulticastNotification,
  sendTopicNotification
}; 