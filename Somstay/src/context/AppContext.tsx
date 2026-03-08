import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
export type Language = 'en' | 'so';

export interface AppSettings {
    darkMode: boolean;
    language: Language;
    locationEnabled: boolean;
}

export interface UserLocation {
    latitude: number;
    longitude: number;
    city?: string;
}

interface AppContextValue {
    settings: AppSettings;
    setDarkMode: (v: boolean) => void;
    setLanguage: (v: Language) => void;
    setLocationEnabled: (v: boolean) => Promise<void>;
    userLocation: UserLocation | null;
    t: (key: string) => string;
}

// ─── Translations ─────────────────────────────────────────────────────────────
// Comprehensive Somali translations for the entire app
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navigation
        home: 'Home',
        explore: 'Explore',
        booking: 'Bookings',
        profile: 'Profile',

        // Home Screen
        good_morning: 'Good morning',
        good_afternoon: 'Good afternoon',
        good_evening: 'Good evening',
        find_your_perfect_stay: 'Find your perfect stay',
        search_cities: 'Search cities...',
        featured_hotels: 'Featured Hotels',
        popular_locations: 'Popular Locations',
        see_all: 'See All',
        top_rated: 'Top Rated',
        nearby: 'Nearby',
        welcome_back: 'Welcome back',
        your_stay: 'Your stay',

        // Explore Screen
        explore_title: 'Explore',
        explore_subtitle: 'Find hotels in Somalia',
        hotels_in: 'Hotels in',
        no_results: 'No results found',
        search_filters: 'Filters',
        select_city: 'Select City',
        select_dates: 'Select Dates',
        check_in: 'Check-in',
        check_out: 'Check-out',
        guests: 'Guests',
        adults: 'Adults',
        children: 'Children',
        ages_above: 'Ages 13 or above',
        ages_2_12: 'Ages 2–12',
        stay_type: 'Stay Type',
        price_range: 'Price Range (per night)',
        amenities: 'Amenities & Recommendation',
        show_hotels: 'Show Hotels',
        clear_all: 'Clear All',
        sort_by: 'Sort by:',
        newest: 'Newest',
        price_low: 'Price Low',
        price_high: 'Price High',
        top_rated_sort: 'Top Rated',

        // Hotel Details
        hotel_details: 'Hotel Details',
        hotel_overview: 'Overview',
        hotel_rooms: 'Rooms',
        hotel_amenities: 'Amenities',
        hotel_reviews: 'Reviews',
        book_now: 'Book Now',
        per_night: '/ night',
        available: 'Available',
        unavailable: 'Unavailable',
        select_room: 'Select Room',

        // Booking
        bookings_title: 'My Bookings',
        upcoming: 'Upcoming',
        completed: 'Completed',
        cancelled: 'Cancelled',
        no_bookings: "You don't have any bookings yet",
        booking_id: 'Booking ID',
        check_in_date: 'Check-in Date',
        check_out_date: 'Check-out Date',
        total_price: 'Total Price',
        view_details: 'View Details',
        rebook_villa: 'Rebook Villa',

        // Profile
        profile_title: 'Profile',
        edit_profile: 'Edit Profile',
        account_settings: 'Account Settings',
        my_favorites: 'My Favorites',
        my_bookings: 'My Bookings',
        notifications: 'Notifications',
        help_support: 'Help & Support',
        privacy_policy: 'Privacy & Policy',
        settings: 'Settings',
        logout: 'Logout',
        logout_confirm: 'Are you sure you want to log out?',
        saved_hotels: 'Saved hotels and properties',
        view_reservations: 'View all your reservations',
        manage_alerts: 'Manage your alerts and preferences',
        chat_email_call: 'Chat, email, or call us anytime',
        how_we_handle: 'How we handle your data',
        app_preferences: 'App preferences and account options',

        // Support
        support_title: 'Help & Support',
        we_are_here: 'We\'re here to help',
        support_24_7: 'Our support team is available 24/7',
        contact_us: 'Contact Us',
        live_chat: 'Live Chat',
        chat_on_whatsapp: 'Chat with us on WhatsApp',
        email_support: 'Email Support',
        call_us: 'Call Us',
        send_message: 'Send a Message',
        describe_issue: 'Describe your issue or question...',
        send: 'Send Message',
        faq: 'Frequently Asked Questions',
        operating_hours: 'Operating Hours',

        // Notifications
        notifications_title: 'Notifications',
        mark_all_read: 'Mark all read',
        recent: 'Recent',
        notification_preferences: 'Notification Preferences',
        booking_updates: 'Booking Updates',
        booking_updates_sub: 'Confirmations, cancellations, and changes',
        promotions: 'Promotions & Deals',
        promotions_sub: 'Exclusive offers and weekend specials',
        price_alerts: 'Price Alerts',
        price_alerts_sub: 'Be notified when prices drop',
        reminders: 'Reminders',
        reminders_sub: 'Check-in reminders and travel tips',
        app_updates: 'App Updates',
        app_updates_sub: 'New features and improvements',

        // Settings
        settings_title: 'Settings',
        appearance: 'Appearance',
        dark_mode: 'Dark Mode',
        dark_mode_sub: 'Switch to dark theme',
        language: 'Language',
        language_sub: 'App display language',
        currency: 'Currency',
        currency_sub: 'Preferred currency for pricing',
        privacy_security: 'Privacy & Security',
        face_id: 'Face ID / Biometrics',
        face_id_sub: 'Use biometrics to log in quickly',
        save_payment: 'Save Payment Info',
        save_payment_sub: 'Securely save cards for faster checkout',
        location_services: 'Location Services',
        location_services_sub: 'Allow app to access your location',
        analytics: 'Analytics & Diagnostics',
        analytics_sub: 'Help improve Somstay with usage data',
        account: 'Account',
        change_password: 'Change Password',
        clear_cache: 'Clear Cache',
        download_data: 'Download My Data',
        about: 'About',
        app_version: 'App Version',
        rate_somstay: 'Rate Somstay',
        share_somstay: 'Share Somstay',
        danger_zone: 'Danger Zone',
        delete_account: 'Delete Account',
        delete_account_sub: 'Permanently remove your account and all associated data',

        // Privacy Policy
        privacy_title: 'Privacy & Policy',
        your_privacy_matters: 'Your Privacy Matters',
        last_updated: 'Last updated',
        privacy_hero_sub: 'Somstay is committed to protecting your personal information and being transparent about how we use it.',

        // General
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        done: 'Done',
        back: 'Back',
        close: 'Close',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        night: 'night',
        nights: 'nights',
        guest: 'Guest',
        somstay_version: 'Somstay v1.0.0',
    },

    so: {
        // Navigation
        home: 'Guriga',
        explore: 'Baadhi',
        booking: 'Buukinnada',
        profile: 'Xogahayaga',

        // Home Screen
        good_morning: 'Subax wanaagsan',
        good_afternoon: 'Galab wanaagsan',
        good_evening: 'Fiid wanaagsan',
        find_your_perfect_stay: 'Raadi meel aad deganaatid',
        search_cities: 'Raadi magaalada...',
        featured_hotels: 'Hoteelada La Xusay',
        popular_locations: 'Goobaha Caanka ah',
        see_all: 'Arag Dhammaan',
        top_rated: 'Kuwa Ugu Wanaagsan',
        nearby: 'Kuwa Dhow',
        welcome_back: 'Ku soo dhowow',
        your_stay: 'Joogitaankaaga',

        // Explore Screen
        explore_title: 'Baadhi',
        explore_subtitle: 'Raadi hoteelada Soomaaliya',
        hotels_in: 'Hoteelada',
        no_results: 'Wax lama helin',
        search_filters: 'Xulashada',
        select_city: 'Dooro Magaalo',
        select_dates: 'Dooro Taariikhda',
        check_in: 'Geli',
        check_out: 'Bax',
        guests: 'Martida',
        adults: 'Dadka Waaweyn',
        children: 'Caruurta',
        ages_above: '13 jir iyo ka weyn',
        ages_2_12: '2–12 jir',
        stay_type: 'Nooca Joogitaanka',
        price_range: 'Qiimaha (Habeenkii)',
        amenities: 'Adeegyada & Talooyinka',
        show_hotels: 'Tus Hoteelada',
        clear_all: 'Nadiifi Dhammaan',
        sort_by: 'Kala sooc:',
        newest: 'Kuwa Cusub',
        price_low: 'Qiime Hoose',
        price_high: 'Qiime Sare',
        top_rated_sort: 'Kuwa Ugu Wanaagsan',

        // Hotel Details
        hotel_details: 'Faahfaahinta Hoteelka',
        hotel_overview: 'Guud ahaan',
        hotel_rooms: 'Qolalka',
        hotel_amenities: 'Adeegyada',
        hotel_reviews: 'Faallooyinka',
        book_now: 'Buuki Hadda',
        per_night: '/ Habeenk.',
        available: 'La Heli Karaa',
        unavailable: 'La Heli Kari Waayo',
        select_room: 'Dooro Qol',

        // Booking
        bookings_title: 'Buukinnadadayda',
        upcoming: 'Soo Socda',
        completed: 'La Dhammaystiray',
        cancelled: 'La Joojiyay',
        no_bookings: 'Weli buukin la yeelayo',
        booking_id: 'Lambarka Buukinka',
        check_in_date: 'Taariikhda Gelitaanka',
        check_out_date: 'Taariikhda Bixitaanka',
        total_price: 'Wadarta Qiimaha',
        view_details: 'Arag Faahfaahinta',
        rebook_villa: 'Kireyso Mar Kale',

        // Profile
        profile_title: 'Xogahayaga',
        edit_profile: 'Wax ka Baddal Xogta',
        account_settings: 'Dejinta Akawntiga',
        my_favorites: 'Kuwa Aan Jecelahay',
        my_bookings: 'Buukinnadadayda',
        notifications: 'Ogeysiisyada',
        help_support: 'Caawimada & Taageerada',
        privacy_policy: 'Qaanuunka Asturnaanta',
        settings: 'Dejinta',
        logout: 'Ka Bax',
        logout_confirm: 'Ma hubtaa inaad ka baxayso akawntigaaga?',
        saved_hotels: 'Hoteelada la kaydiyay',
        view_reservations: 'Arag dhammaan buukinnadadaada',
        manage_alerts: 'Maamul ogeysiisyagaaga',
        chat_email_call: 'Nala sheekayso, email nooga soo dir, ama nala soo xiriir',
        how_we_handle: 'Sida aan xogta kugu maamusho',
        app_preferences: 'Doorashada app-ka iyo akawntigaaga',

        // Support
        support_title: 'Caawimada & Taageerada',
        we_are_here: 'Waxaanu halkan nahay si aan ku caawino',
        support_24_7: 'Kooxdayda caawimada waxay shaqeysaa 24/7',
        contact_us: 'Nala Xiriir',
        live_chat: 'Sheekaysi Toos ah',
        chat_on_whatsapp: 'Nala sheekayso WhatsApp-ka',
        email_support: 'Taageerada Emailka',
        call_us: 'Nala Soo Xiriir',
        send_message: 'Dir Fariinta',
        describe_issue: 'Sharax dhibaayadaada ama su\'aashaada...',
        send: 'Dir Fariinta',
        faq: 'Su\'aalaha Badanaa La Weydiiyo',
        operating_hours: 'Saacadaha Shaqada',

        // Notifications
        notifications_title: 'Ogeysiisyada',
        mark_all_read: 'Dhammaan aqri',
        recent: 'Dhowaan',
        notification_preferences: 'Doorashada Ogeysiisyada',
        booking_updates: 'Cusbooneysiinaadka Buukinka',
        booking_updates_sub: 'Xaqiijinta, baajinta, iyo isbeddelada',
        promotions: 'Xawaaraha & Heshiisyada',
        promotions_sub: 'Qasnadaha gaar ah iyo xawaaraha toddobaadka',
        price_alerts: 'Ogeysiisyada Qiimaha',
        price_alerts_sub: 'Ogowso marka qiimaha hoos u dhaco',
        reminders: 'Xusustayaasha',
        reminders_sub: 'Xusustayaasha gelitaanka iyo talooyinka safarka',
        app_updates: 'Cusubohaysiinaadka App-ka',
        app_updates_sub: 'Sifooyin cusub iyo hormarinta',

        // Settings
        settings_title: 'Dejinta',
        appearance: 'Muuqaalka',
        dark_mode: 'Habka Madow',
        dark_mode_sub: 'Beddel habka madow',
        language: 'Luqadda',
        language_sub: 'Luqadda muujinta app-ka',
        currency: 'Lacagta',
        currency_sub: 'Lacagta la doonayo ee qiimayaasha',
        privacy_security: 'Asturnaanta & Amniga',
        face_id: 'Aqoonsiga Wejiga / Faraha',
        face_id_sub: 'Isticmaal aqoonsigaaga si degdeg ah u geli',
        save_payment: 'Kaydso Macluumaadka Lacagta',
        save_payment_sub: 'Si ammaan ah u kaydso kaadhadaha si ay u degdegaan',
        location_services: 'Adeegyada Goobta',
        location_services_sub: 'U ogolow app-ka inuu galo goobtagaaga',
        analytics: 'Xisaabaadka & Xog-baadhisteynta',
        analytics_sub: 'Caawi hormarinta Somstay iyada oo lagu soo shegayo xogta isticmaalka',
        account: 'Akawntiga',
        change_password: 'Beddel Erayga Sirta',
        clear_cache: 'Nadiifi Kaachiga',
        download_data: 'Soo Degso Xogtayda',
        about: 'Ku Saabsan',
        app_version: 'Nooca App-ka',
        rate_somstay: 'Qii Somstay',
        share_somstay: 'La Wadaag Somstay',
        danger_zone: 'Aagga Khatariga',
        delete_account: 'Tirtir Akawntiga',
        delete_account_sub: 'Permanently nadiifi akawntigaaga iyo dhammaan xogtaada',

        // Privacy Policy
        privacy_title: 'Qaanuunka Asturnaanta',
        your_privacy_matters: 'Asturnaantaadu Muhiim Bay Tahay',
        last_updated: 'Cusbooneysiintii ugu dambeysay',
        privacy_hero_sub: 'Somstay waxay ku heshay xogtaada shakhsi ahaaneed iyo sidaan si shaashad leh u u isticmaalno.',

        // General
        cancel: 'Jooji',
        confirm: 'Xaqiiji',
        save: 'Kaydso',
        done: 'Dhammee',
        back: 'Dib',
        close: 'Xidh',
        loading: 'Soo raraya...',
        error: 'Khalad',
        success: 'Guul',
        night: 'habeenkii',
        nights: 'habeenood',
        guest: 'Marti',
        somstay_version: 'Somstay v1.0.0',
    },
};

// ─── Dark Mode Colors ─────────────────────────────────────────────────────────
export const darkTheme = {
    background: '#0D1117',
    surface: '#161B22',
    surfaceSecondary: '#21262D',
    card: '#1C2128',
    border: '#30363D',
    text: '#E6EDF3',
    textSecondary: '#8B949E',
    primary: '#0288AC',
    inputBg: '#21262D',
};

export const lightTheme = {
    background: '#F6F8FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',
    card: '#FFFFFF',
    border: '#E5E7EB',
    text: '#04252E',
    textSecondary: '#5A5E5E',
    primary: '#0288AC',
    inputBg: '#F7F8F9',
};

export type AppTheme = typeof lightTheme;

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextValue>({
    settings: { darkMode: false, language: 'en', locationEnabled: false },
    setDarkMode: () => {},
    setLanguage: () => {},
    setLocationEnabled: async () => {},
    userLocation: null,
    t: (key) => key,
});

const STORAGE_KEY = '@somstay_app_settings';

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings>({
        darkMode: false,
        language: 'en',
        locationEnabled: false,
    });
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    // Load persisted settings on mount
    useEffect(() => {
        SecureStore.getItemAsync(STORAGE_KEY).then((raw: string | null) => {
            if (raw) {
                try {
                    const parsed = JSON.parse(raw) as AppSettings;
                    setSettings(parsed);
                    if (parsed.locationEnabled) fetchLocation();
                } catch {}
            }
        }).catch(() => {});
    }, []);

    // Persist settings whenever they change
    const persist = useCallback((next: AppSettings) => {
        SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        setSettings(next);
    }, []);

    const setDarkMode = useCallback((v: boolean) => {
        persist({ ...settings, darkMode: v });
    }, [settings, persist]);

    const setLanguage = useCallback((v: Language) => {
        persist({ ...settings, language: v });
    }, [settings, persist]);

    const fetchLocation = async () => {
        try {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            // Reverse geocode to get city name
            const [place] = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
            setUserLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                city: place?.city || place?.region || 'Hargeisa',
            });
        } catch {
            // If we can't get location, silently fail
        }
    };

    const setLocationEnabled = useCallback(async (v: boolean) => {
        if (v) {
            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    settings.language === 'so' ? 'Goobta La Diday' : 'Location Denied',
                    settings.language === 'so'
                        ? 'Fadlan fur Dejinta > Adeegyada Goobta si aad u ogolaato galaynta goobta.'
                        : 'Please go to Settings > Location Services to enable location access.',
                    [{ text: settings.language === 'so' ? 'OK' : 'OK' }]
                );
                return;
            }
            await fetchLocation();
        } else {
            setUserLocation(null);
        }
        persist({ ...settings, locationEnabled: v });
    }, [settings, persist]);

    // Translate helper
    const t = useCallback((key: string): string => {
        return translations[settings.language]?.[key] ?? translations.en[key] ?? key;
    }, [settings.language]);

    return (
        <AppContext.Provider value={{ settings, setDarkMode, setLanguage, setLocationEnabled, userLocation, t }}>
            {children}
        </AppContext.Provider>
    );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useApp = () => useContext(AppContext);

export const useTheme = () => {
    const { settings } = useApp();
    return settings.darkMode ? darkTheme : lightTheme;
};
