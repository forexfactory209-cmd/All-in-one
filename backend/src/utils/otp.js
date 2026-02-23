/**
 * OTP Utility
 * Generates and verifies one-time passwords.
 */
module.exports = {
    generateOTP: (length = 6) => {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    },

    verifyOTP: (userOtp, storedOtp) => {
        return userOtp === storedOtp;
    }
};
