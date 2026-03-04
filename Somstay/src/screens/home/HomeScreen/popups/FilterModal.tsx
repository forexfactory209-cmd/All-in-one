import React, { useState, useRef, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    Switch,
    Pressable,
    PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './FilterModal.styles';
import { colors } from '@/src/theme';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

const DESTINATIONS = [
    'Hargeisa',
    'Borama',
    'Burao',
    'Berbera',
    'Gabiley',
    'Sheikh',
    'Erigavo',
    'Las Anod',
];

const PROPERTY_TYPES = [
    'All',
    'Hotel',
    'Apartment',
    'Villa',
    'Cabin',
    'Loft',
];

const RATINGS = ['5', '4+', '3+'];
const MAX_PRICE = 200;

export const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    onClose,
    onApply,
}) => {
    const [selectedDestination, setSelectedDestination] = useState('Hargeisa');
    const [selectedPropertyType, setSelectedPropertyType] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [isVerifiedOnly, setIsVerifiedOnly] = useState(true);
    const [minRating, setMinRating] = useState('4+');
    const [sliderWidth, setSliderWidth] = useState(0);

    const priceRangeRef = useRef(priceRange);
    priceRangeRef.current = priceRange;

    const handleReset = () => {
        setSelectedDestination('Hargeisa');
        setSelectedPropertyType('All');
        setPriceRange([0, 200]);
        setIsVerifiedOnly(true);
        setMinRating('4+');
    };

    const handleApply = () => {
        onApply({
            destination: selectedDestination,
            propertyType: selectedPropertyType,
            priceRange,
            verifiedOnly: isVerifiedOnly,
            minRating,
        });
        onClose();
    };

    // Slider Logic
    const getPriceFromPos = (pos: number) => {
        if (sliderWidth === 0) return 0;
        const ratio = Math.min(Math.max(pos / sliderWidth, 0), 1);
        const price = Math.round(ratio * MAX_PRICE);

        // Snap to steps: 1-20-60-100-200
        if (price <= 20) return price <= 10 ? 1 : 20;
        if (price <= 60) return 60;
        if (price <= 100) return 100;
        return 200;
    };

    const minThumbPanResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (sliderWidth === 0) return;
            const currentMinPrice = priceRangeRef.current[0];
            const currentMaxPrice = priceRangeRef.current[1];

            const startPos = (currentMinPrice / MAX_PRICE) * sliderWidth;
            const newPos = startPos + gestureState.dx;
            const newPrice = getPriceFromPos(newPos);

            if (newPrice < currentMaxPrice) {
                setPriceRange([newPrice, currentMaxPrice]);
            }
        },
    }), [sliderWidth]);

    const maxThumbPanResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (sliderWidth === 0) return;
            const currentMinPrice = priceRangeRef.current[0];
            const currentMaxPrice = priceRangeRef.current[1];

            const startPos = (currentMaxPrice / MAX_PRICE) * sliderWidth;
            const newPos = startPos + gestureState.dx;
            const newPrice = getPriceFromPos(newPos);

            if (newPrice > currentMinPrice) {
                setPriceRange([currentMinPrice, newPrice]);
            }
        },
    }), [sliderWidth]);

    const leftThumbPos = sliderWidth ? (priceRange[0] / MAX_PRICE) * 100 : 0;
    const rightThumbPos = sliderWidth ? (priceRange[1] / MAX_PRICE) * 100 : 100;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable style={{ flex: 1 }} onPress={onClose} />
                <View style={styles.modalContainer}>
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Filters</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.dark} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                    >
                        {/* Destinations */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Popular Destinations</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.destinationScrollView}
                                contentContainerStyle={{ paddingRight: 20 }}
                            >
                                {DESTINATIONS.map((city) => (
                                    <TouchableOpacity
                                        key={city}
                                        style={[
                                            styles.destinationChip,
                                            selectedDestination === city && styles.activeDestinationChip,
                                        ]}
                                        onPress={() => setSelectedDestination(city)}
                                    >
                                        <Text
                                            style={[
                                                styles.destinationText,
                                                selectedDestination === city && styles.activeDestinationText,
                                            ]}
                                        >
                                            {city}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Property Type */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Property Type</Text>
                            <View style={styles.chipContainer}>
                                {PROPERTY_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.chip,
                                            selectedPropertyType === type && styles.activeChip,
                                        ]}
                                        onPress={() => setSelectedPropertyType(type)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                selectedPropertyType === type && styles.activeChipText,
                                            ]}
                                        >
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Price Range */}
                        <View style={styles.section}>
                            <View style={styles.priceRangeHeader}>
                                <Text style={styles.sectionTitle}>Price Range</Text>
                                <View style={styles.priceDisplayRow}>
                                    <View style={styles.priceBadge}>
                                        <Text style={styles.priceBadgeText}>${priceRange[0]}</Text>
                                    </View>
                                    <Text style={styles.priceSeparator}>—</Text>
                                    <View style={styles.priceBadge}>
                                        <Text style={styles.priceBadgeText}>
                                            ${priceRange[1]}{priceRange[1] === MAX_PRICE ? '+' : ''}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={styles.sliderContainer}
                                onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                            >
                                <View style={styles.sliderTrack}>
                                    {/* Active Track */}
                                    <View style={[
                                        styles.activeTrack,
                                        {
                                            left: `${leftThumbPos}%`,
                                            width: `${rightThumbPos - leftThumbPos}%`
                                        }
                                    ]} />

                                    {/* Left Thumb */}
                                    <View
                                        {...minThumbPanResponder.panHandlers}
                                        style={[
                                            styles.sliderThumb,
                                            { left: `${leftThumbPos}%`, marginLeft: -12 }
                                        ]}
                                    />

                                    {/* Right Thumb */}
                                    <View
                                        {...maxThumbPanResponder.panHandlers}
                                        style={[
                                            styles.sliderThumb,
                                            { left: `${rightThumbPos}%`, marginLeft: -12 }
                                        ]}
                                    />
                                </View>
                                <View style={styles.sliderLabels}>
                                    <Text style={styles.sliderLabelText}>$1</Text>
                                    <Text style={styles.sliderLabelText}>$20</Text>
                                    <Text style={styles.sliderLabelText}>$60</Text>
                                    <Text style={styles.sliderLabelText}>$100</Text>
                                    <Text style={styles.sliderLabelText}>$200</Text>
                                </View>
                            </View>
                        </View>

                        {/* Trust & Verification */}
                        <View style={styles.rowSection}>
                            <View style={styles.textContainer}>
                                <Text style={styles.sectionTitle}>Trust & Verification</Text>
                                <Text style={styles.rowSubTitle}>Only show listings with verified badges</Text>
                            </View>
                            <Switch
                                value={isVerifiedOnly}
                                onValueChange={setIsVerifiedOnly}
                                trackColor={{ false: colors.gray200, true: colors.success }}
                                thumbColor={colors.white}
                                ios_backgroundColor={colors.gray200}
                            />
                        </View>

                        {/* Minimum Rating */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Minimum Rating</Text>
                            <View style={styles.ratingChipContainer}>
                                {RATINGS.map((rating) => (
                                    <TouchableOpacity
                                        key={rating}
                                        style={[
                                            styles.ratingChip,
                                            minRating === rating && styles.activeRatingChip,
                                        ]}
                                        onPress={() => setMinRating(rating)}
                                    >
                                        <Ionicons
                                            name="star"
                                            size={18}
                                            color={minRating === rating ? '#FFD700' : '#FFD700'}
                                        />
                                        <Text style={styles.ratingText}>{rating}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
