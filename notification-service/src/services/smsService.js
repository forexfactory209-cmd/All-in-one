async function sendSMS(phoneNumber, message) {
    if (!phoneNumber) {
        console.log('No phone number provided');
        return;
    }

    try {
        console.log(`[SMSService] Sending SMS to ${phoneNumber}: ${message}`);
        // Mock Integration
        // const response = await someTelecomGatewayClient.send({ to: phoneNumber, body: message });
        console.log(`[SMSService] SMS simulated successfully sent!`);
    } catch (error) {
        console.error(`[SMSService] Error sending SMS:`, error);
        throw error;
    }
}

module.exports = {
    sendSMS
};
