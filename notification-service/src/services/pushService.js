const admin = require('firebase-admin');

// Mock initialization for now, unless the user provides credentials
// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert(require('../config/firebase.json'))
//     });
// }

async function sendPushNotification(deviceToken, payload) {
    if (!deviceToken) {
        console.log('No device token provided for push notification');
        return;
    }

    const message = {
        notification: {
            title: payload.title,
            body: payload.body
        },
        data: payload.data || {},
        token: deviceToken
    };

    try {
        console.log(`[PushService] Sending Push Notification to token ${deviceToken}:`, payload.title);
        // Using mock success for now as we don't have real FCM tokens set up
        // await admin.messaging().send(message);
        console.log(`[PushService] Push Notification simulated sent successfully!`);
    } catch (error) {
        console.error(`[PushService] Error sending push notification:`, error);
        throw error;
    }
}

module.exports = {
    sendPushNotification
};
