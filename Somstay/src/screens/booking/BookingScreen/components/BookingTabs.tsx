import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp, useTheme } from '@/src/context/AppContext';

interface BookingTabsProps {
    activeTab: 'upcoming' | 'past';
    onTabChange: (tab: 'upcoming' | 'past') => void;
}

export const BookingTabs: React.FC<BookingTabsProps> = ({ activeTab, onTabChange }) => {
    const { t } = useApp();
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <TouchableOpacity
                style={styles.tab}
                onPress={() => onTabChange('upcoming')}
            >
                <Text style={[
                    styles.tabText,
                    { color: activeTab === 'upcoming' ? theme.primary : theme.textSecondary, fontWeight: activeTab === 'upcoming' ? '700' : '500' }
                ]}>
                    {t('upcoming')}
                </Text>
                {activeTab === 'upcoming' && <View style={[styles.activeUnderline, { backgroundColor: theme.primary }]} />}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tab}
                onPress={() => onTabChange('past')}
            >
                <Text style={[
                    styles.tabText,
                    { color: activeTab === 'past' ? theme.primary : theme.textSecondary, fontWeight: activeTab === 'past' ? '700' : '500' }
                ]}>
                    {t('completed')}
                </Text>
                {activeTab === 'past' && <View style={[styles.activeUnderline, { backgroundColor: theme.primary }]} />}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        position: 'relative',
    },
    tabText: {
        fontSize: 16,
    },
    activeUnderline: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        height: 3,
        borderRadius: 2,
    },
});
