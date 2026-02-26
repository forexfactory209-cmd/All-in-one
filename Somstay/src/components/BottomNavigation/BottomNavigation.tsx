import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './BottomNavigation.styles';
import { colors } from '@/src/theme';

interface NavItem {
    id: string;
    label: string;
    icon: string;
    iconFilled: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'index', label: 'Home', icon: 'home-outline', iconFilled: 'home' },
    { id: 'explore', label: 'Explore', icon: 'search-outline', iconFilled: 'search' },
    { id: 'bookings', label: 'Bookings', icon: 'newspaper-outline', iconFilled: 'newspaper' },
    { id: 'account', label: 'Account', icon: 'person-outline', iconFilled: 'person' },
];

interface BottomNavigationProps {
    activeTab: string;
    onTabPress: (tabId: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
    activeTab,
    onTabPress,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 15) }]}>
            {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.navItem}
                        onPress={() => onTabPress(item.id)}
                        activeOpacity={0.7}
                    >
                        <Icon
                            name={isActive ? (item.iconFilled as any) : (item.icon as any)}
                            size={24}
                            color={isActive ? colors.white : 'rgba(255, 255, 255, 0.7)'}
                        />
                        <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
