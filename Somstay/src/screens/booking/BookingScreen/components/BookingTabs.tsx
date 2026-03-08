import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

const { width } = Dimensions.get('window');

interface BookingTabsProps {
    activeTab: 'upcoming' | 'past';
    onTabChange: (tab: 'upcoming' | 'past') => void;
}

export const BookingTabs: React.FC<BookingTabsProps> = ({ activeTab, onTabChange }) => {
    const { t } = useApp();
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <TouchableOpacity
                style={styles.tab}
                onPress={() => onTabChange('upcoming')}
            >
                <Text style={[styles.tabText, { color: theme.textSecondary }, activeTab === 'upcoming' && styles.activeTabText]}>{t('upcoming')}</Text>
                {activeTab === 'upcoming' && <View style={styles.activeUnderline} />}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tab}
                onPress={() => onTabChange('past')}
            >
                <Text style={[styles.tabText, { color: theme.textSecondary }, activeTab === 'past' && styles.activeTabText]}>{t('completed')}</Text>
                {activeTab === 'past' && <View style={styles.activeUnderline} />}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        position: 'relative',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#999',
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: '700',
    },
    activeUnderline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
});
