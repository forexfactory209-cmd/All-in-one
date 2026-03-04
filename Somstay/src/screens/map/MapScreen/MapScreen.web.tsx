import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './styles/MapScreen.styles';
import { colors } from '@/src/theme';
import { FilterModal } from '../../home/HomeScreen/popups/FilterModal';

export const MapScreen: React.FC = () => {
    const router = useRouter();
    const { city } = useLocalSearchParams<{ city?: string }>();
    const [filterVisible, setFilterVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MAP</Text>
                <View style={styles.shareButton} />
            </View>

            <View style={[styles.mapContainer, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }]}>
                <View style={{
                    width: 100, height: 100, borderRadius: 50, backgroundColor: '#E6F3F7',
                    justifyContent: 'center', alignItems: 'center', marginBottom: 24
                }}>
                    <Ionicons name="map" size={48} color={colors.primary} />
                </View>

                <Text style={{ fontSize: 22, fontWeight: '800', color: colors.dark, marginBottom: 12 }}>
                    Maps on Web
                </Text>

                <Text style={{
                    fontSize: 15, color: colors.text, textAlign: 'center',
                    marginHorizontal: 40, marginBottom: 32, lineHeight: 22
                }}>
                    Interactive maps are optimized for our native mobile app. Please switch to list view to browse properties on the web.
                </Text>

                <TouchableOpacity
                    style={{
                        backgroundColor: colors.primary,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 28,
                        paddingVertical: 16,
                        borderRadius: 16,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5
                    }}
                    onPress={() => router.replace({
                        pathname: '/search-results',
                        params: { city: city || 'Hargeisa' }
                    })}
                >
                    <Ionicons name="list" size={20} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={{ color: colors.white, fontWeight: '700', fontSize: 16 }}>
                        Browse List View
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Filter Modal Integration */}
            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(filters) => {
                    setFilterVisible(false);
                }}
            />
        </SafeAreaView>
    );
};
