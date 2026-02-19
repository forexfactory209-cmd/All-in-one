/**
 * Folder Structure Setup Script
 * Creates the complete folder structure for the Vacation Rental App
 * Run with: node setup-folders.js
 */

const fs = require('fs');
const path = require('path');

// Base directory - VacationRentalApp/src
const baseDir = path.join(__dirname, 'VacationRentalApp', 'src');

// Complete folder structure
const folders = [
    // Screens - Auth
    'screens/auth/LoginScreen/components',
    'screens/auth/LoginScreen/hooks',
    'screens/auth/LoginScreen/popups',
    'screens/auth/RegisterScreen/components',
    'screens/auth/RegisterScreen/hooks',
    'screens/auth/RegisterScreen/popups',
    'screens/auth/ForgotPasswordScreen/components',
    'screens/auth/ForgotPasswordScreen/hooks',

    // Screens - Home
    'screens/home/HomeScreen/components',
    'screens/home/HomeScreen/hooks',
    'screens/home/HomeScreen/popups',
    'screens/home/SearchResultsScreen/components',
    'screens/home/SearchResultsScreen/hooks',
    'screens/home/SearchResultsScreen/popups',

    // Screens - Property
    'screens/property/PropertyDetailsScreen/components',
    'screens/property/PropertyDetailsScreen/hooks',
    'screens/property/PropertyDetailsScreen/popups',
    'screens/property/CreatePropertyScreen/components',
    'screens/property/CreatePropertyScreen/hooks',
    'screens/property/CreatePropertyScreen/popups',
    'screens/property/ManagePropertiesScreen/components',
    'screens/property/ManagePropertiesScreen/hooks',
    'screens/property/ManagePropertiesScreen/popups',

    // Screens - Booking
    'screens/booking/BookingRequestScreen/components',
    'screens/booking/BookingRequestScreen/hooks',
    'screens/booking/BookingRequestScreen/popups',
    'screens/booking/BookingConfirmationScreen/components',
    'screens/booking/BookingConfirmationScreen/hooks',
    'screens/booking/MyBookingsScreen/components',
    'screens/booking/MyBookingsScreen/hooks',
    'screens/booking/MyBookingsScreen/popups',

    // Screens - Messages
    'screens/messages/MessagesListScreen/components',
    'screens/messages/MessagesListScreen/hooks',
    'screens/messages/ChatScreen/components',
    'screens/messages/ChatScreen/hooks',
    'screens/messages/ChatScreen/popups',

    // Screens - Profile
    'screens/profile/ProfileScreen/components',
    'screens/profile/ProfileScreen/hooks',
    'screens/profile/ProfileScreen/popups',
    'screens/profile/EditProfileScreen/components',
    'screens/profile/EditProfileScreen/hooks',
    'screens/profile/VerificationScreen/components',
    'screens/profile/VerificationScreen/hooks',

    // Screens - Reviews
    'screens/reviews/WriteReviewScreen/components',
    'screens/reviews/WriteReviewScreen/hooks',
    'screens/reviews/ReviewsScreen/components',
    'screens/reviews/ReviewsScreen/hooks',
    'screens/reviews/ReviewsScreen/popups',

    // Global Components
    'components/Button',
    'components/Input',
    'components/Card',
    'components/Avatar',
    'components/Badge',
    'components/LoadingSpinner',
    'components/EmptyState',
    'components/ErrorBoundary',
    'components/BottomSheet',
    'components/Modal',

    // Navigation
    'navigation',

    // Services
    'services/api',
    'services/auth',
    'services/property',
    'services/booking',
    'services/user',
    'services/review',
    'services/message',
    'services/payment',
    'services/upload',

    // Store
    'store/slices',
    'store/selectors',

    // Hooks
    'hooks',

    // Utils
    'utils/validation',
    'utils/formatting',
    'utils/helpers',
    'utils/constants',

    // Types
    'types/models',
    'types/api',
    'types/common',

    // Theme
    'theme',

    // Assets
    'assets/images',
    'assets/icons',
    'assets/fonts',
    'assets/animations',

    // Config
    'config',
];

// Create folders
console.log('🚀 Creating folder structure for Vacation Rental App...\n');

folders.forEach(folder => {
    const fullPath = path.join(baseDir, folder);

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created: src/${folder}`);
    } else {
        console.log(`⏭️  Exists: src/${folder}`);
    }
});

console.log('\n✨ Folder structure created successfully!');
console.log(`\n📁 Total folders created: ${folders.length}`);
console.log(`📍 Base directory: ${baseDir}\n`);
console.log('🎯 Next steps:');
console.log('   1. cd VacationRentalApp');
console.log('   2. npm install');
console.log('   3. Start creating your screens and components!\n');
