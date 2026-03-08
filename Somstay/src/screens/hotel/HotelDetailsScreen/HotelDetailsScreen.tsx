import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, Modal, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../property/PropertyDetailsScreen/styles/PropertyDetailsScreen.styles';
import { colors, spacing } from '@/src/theme';
import { useHotelDetails } from '../../property/PropertyDetailsScreen/hooks/useHotelDetails';
import { useWishlist } from '../../home/HomeScreen/hooks/useWishlist';

export const HotelDetailsScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();

    const { hotel, loading, error } = useHotelDetails(id as string);
    const { wishlistedIds, toggleWishlist } = useWishlist();
    const [roomsModalVisible, setRoomsModalVisible] = useState(false);
    const isFavorite = id ? wishlistedIds.has(id.toString()) : false;
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedRoomType, setSelectedRoomType] = useState('All');
    const { width: screenWidth } = Dimensions.get('window');

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!hotel) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Hotel not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: colors.primary, marginTop: 10 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const images = hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.main_image];

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setActiveImageIndex(index);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Slider Section */}
                <View style={styles.imageSliderContainer}>
                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: (item && typeof item === 'string' && item.startsWith('http')) ? item : `http://206.183.129.220:5000/uploads/${item || 'placeholder.jpg'}` }}
                                style={{ width: screenWidth, height: 300 }}
                                resizeMode="cover"
                            />
                        )}
                    />

                    {/* Header Controls */}
                    <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.dark} />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => id && toggleWishlist(id as string)} style={styles.iconButton}>
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={24}
                                    color={isFavorite ? colors.error : colors.dark}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="share-outline" size={24} color={colors.dark} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {images.map((_: any, index: number) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeImageIndex === index && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Main Info */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{hotel.name}</Text>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#06A649" />
                            <Text style={styles.verifiedText}>VERIFIED</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-sharp" size={16} color={colors.primary} />
                        <Text style={styles.locationText}>{hotel.location}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{hotel.rating || '4.5'}</Text>
                        </View>
                    </View>

                    {/* About Section */}
                    <Text style={styles.sectionTitle}>About this hotel</Text>
                    <Text style={styles.description} numberOfLines={3}>
                        {hotel.description || 'No description available for this property.'}
                    </Text>

                    {/* Rooms Section */}
                    {hotel.rooms && hotel.rooms.length > 0 && (
                        <>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionTitle}>Available Rooms</Text>
                                {hotel.rooms.length > 4 && (
                                    <TouchableOpacity onPress={() => setRoomsModalVisible(true)}>
                                        <Text style={styles.seeAllText}>See All ({hotel.rooms.length})</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Dynamic Room Filter */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                                {['All', ...new Set(hotel.rooms.map((r: any) => r.type))].map((type: any) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={{
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            backgroundColor: selectedRoomType === type ? colors.primary : '#F0F0F0',
                                            marginRight: 10,
                                            borderWidth: 1,
                                            borderColor: selectedRoomType === type ? colors.primary : '#E0E0E0'
                                        }}
                                        onPress={() => setSelectedRoomType(type)}
                                    >
                                        <Text style={{
                                            color: selectedRoomType === type ? colors.white : colors.dark,
                                            fontWeight: '600',
                                            fontSize: 13
                                        }}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                {hotel.rooms
                                    .filter((r: any) => selectedRoomType === 'All' || r.type === selectedRoomType)
                                    .slice(0, 4)
                                    .map((innerRoom: any) => (
                                    <TouchableOpacity
                                        key={innerRoom.id}
                                        style={{ width: 220, marginRight: 15, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#eee', padding: 8, ...shadows.small }}
                                        onPress={() => router.push({ pathname: '/property/[id]', params: { id: innerRoom.id } })}
                                    >
                                        <Image
                                            source={{ uri: (innerRoom.image_url && typeof innerRoom.image_url === 'string' && innerRoom.image_url.startsWith('http')) ? innerRoom.image_url : `http://206.183.129.220:5000/uploads/${innerRoom.image_url || 'placeholder.jpg'}` }}
                                            style={{ width: '100%', height: 130, borderRadius: 12 }}
                                        />
                                        <View style={{ padding: 6 }}>
                                            <Text style={{ fontWeight: '700', fontSize: 16, color: colors.dark }}>{innerRoom.type} Room</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                                                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 15 }}>${innerRoom.price}<Text style={{ fontSize: 10, fontWeight: '400', color: '#999' }}>/night</Text></Text>
                                                <View style={{ backgroundColor: '#F0F9FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                                                    <Text style={{ fontSize: 10, color: colors.primary, fontWeight: '600' }}>Available</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                                {hotel.rooms.length > 4 && (
                                    <TouchableOpacity 
                                       style={{ width: 140, marginRight: 15, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 8, justifyContent: 'center', alignItems: 'center' }}
                                       onPress={() => setRoomsModalVisible(true)}
                                    >
                                        <Ionicons name="arrow-forward-circle" size={40} color={colors.primary} />
                                        <Text style={{ marginTop: 8, fontWeight: '600', color: colors.primary }}>See More</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </>
                    )}

                    {/* Amenities Section */}
                    <Text style={styles.sectionTitle}>Hotel Amenities</Text>
                    <View style={styles.amenitiesGrid}>
                        {(hotel.amenities || []).map((item: any) => (
                            <View key={item.id} style={styles.amenityItem}>
                                <MaterialCommunityIcons name={(item.icon || 'star-outline') as any} size={24} color="#555" />
                                <Text style={styles.amenityText}>{item.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Rooms Full List Modal */}
            <Modal
                visible={roomsModalVisible}
                animationType="slide"
                onRequestClose={() => setRoomsModalVisible(false)}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                        <TouchableOpacity onPress={() => setRoomsModalVisible(false)}>
                            <Ionicons name="close" size={28} color={colors.dark} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: '700' }}>Available Rooms</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    {/* Modal Room Filter */}
                    <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {['All', ...new Set(hotel.rooms.map((r: any) => r.type))].map((type: any) => (
                                <TouchableOpacity
                                    key={type}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                        backgroundColor: selectedRoomType === type ? colors.primary : '#F0F0F0',
                                        marginRight: 10,
                                        borderWidth: 1,
                                        borderColor: selectedRoomType === type ? colors.primary : '#E0E0E0'
                                    }}
                                    onPress={() => setSelectedRoomType(type)}
                                >
                                    <Text style={{
                                        color: selectedRoomType === type ? colors.white : colors.dark,
                                        fontWeight: '600',
                                        fontSize: 13
                                    }}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <FlatList
                        data={hotel.rooms.filter((r: any) => selectedRoomType === 'All' || r.type === selectedRoomType)}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ padding: 15 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{ backgroundColor: '#fff', borderRadius: 16, marginBottom: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', ...shadows.small }}
                                onPress={() => {
                                    setRoomsModalVisible(false);
                                    router.push({ pathname: '/property/[id]', params: { id: item.id } });
                                }}
                            >
                                <Image
                                    source={{ uri: (item.image_url && typeof item.image_url === 'string' && item.image_url.startsWith('http')) ? item.image_url : `http://206.183.129.220:5000/uploads/${item.image_url || 'placeholder.jpg'}` }}
                                    style={{ width: '100%', height: 180 }}
                                />
                                <View style={{ padding: 15 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '700' }}>{item.type} Room</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary }}>${item.price}<Text style={{ fontSize: 12, color: '#666', fontWeight: '400' }}>/night</Text></Text>
                                    </View>
                                    <Text style={{ color: '#666', fontSize: 13, marginBottom: 12 }}>{item.description}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f5f5f5' }}>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <View style={{ backgroundColor: '#F0F9FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                                                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '600' }}>{item.beds} BEDS</Text>
                                            </View>
                                            <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                                                <Text style={{ color: '#06A649', fontSize: 11, fontWeight: '600' }}>{item.status}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity 
                                            style={{ backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 }}
                                            onPress={() => {
                                                setRoomsModalVisible(false);
                                                router.push({ pathname: '/confirm-pay', params: { id: item.id, type: 'room' } });
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Book Room</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const shadows = {
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
};
