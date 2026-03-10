import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './FilterModal.styles';
import { colors } from '@/src/theme';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    hideDestination?: boolean;
}

import { useTheme } from '@/src/context/AppContext';

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, hideDestination = false }) => {
    const theme = useTheme();
    const [selectedType, setSelectedType] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [selectedDestination, setSelectedDestination] = useState('All');
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    // Updated types based on hotel categories
    const propertyTypes = ['All', 'Hotel', 'Apartment', 'Guest House', 'Resort', 'Suite'];
    const destinations = ['All', 'Hargeisa', 'Berbera', 'Borama', 'Burco', 'Cerigabo'];

    const handleApply = () => {
        onApply({
            propertyType: selectedType,
            priceRange,
            destination: selectedDestination === 'All' ? '' : selectedDestination,
            verifiedOnly,
        });
        onClose();
    };

    const handleReset = () => {
        setSelectedType('All');
        setPriceRange([0, 200]);
        setSelectedDestination('All');
        setVerifiedOnly(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
                    <View style={[styles.handle, { backgroundColor: theme.border }]} />

                    <View style={[styles.header, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Filters</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Sort by Destination */}
                        {!hideDestination && (
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Destination</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destinationScrollView}>
                                    {destinations.map((dest) => (
                                        <TouchableOpacity
                                            key={dest}
                                            style={[
                                                styles.destinationChip,
                                                { backgroundColor: theme.surfaceSecondary },
                                                selectedDestination === dest && [styles.activeDestinationChip, { backgroundColor: theme.card }]
                                            ]}
                                            onPress={() => setSelectedDestination(dest)}
                                        >
                                            <Text style={[
                                                styles.destinationText,
                                                { color: theme.textSecondary },
                                                selectedDestination === dest && styles.activeDestinationText
                                            ]}>{dest}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Price Range */}
                        <View style={styles.section}>
                            <View style={styles.priceRangeHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Price range</Text>
                                <View style={styles.priceDisplayRow}>
                                    <View style={[styles.priceBadge, { backgroundColor: theme.surfaceSecondary }]}>
                                        <Text style={styles.priceBadgeText}>${priceRange[0]}</Text>
                                    </View>
                                    <Text style={[styles.priceSeparator, { color: theme.textSecondary }]}>-</Text>
                                    <View style={[styles.priceBadge, { backgroundColor: theme.surfaceSecondary }]}>
                                        <Text style={styles.priceBadgeText}>${priceRange[1]}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.sliderContainer}>
                                <MultiSlider
                                    values={[priceRange[0], priceRange[1]]}
                                    sliderLength={Dimensions.get('window').width - 80}
                                    onValuesChange={(values) => setPriceRange(values)}
                                    min={0}
                                    max={1000}
                                    step={10}
                                    allowOverlap={false}
                                    snapped
                                    selectedStyle={{
                                        backgroundColor: colors.primary,
                                    }}
                                    unselectedStyle={{
                                        backgroundColor: theme.border,
                                    }}
                                    containerStyle={{
                                        height: 40,
                                        alignSelf: 'center',
                                    }}
                                    trackStyle={{
                                        height: 4,
                                        borderRadius: 2,
                                    }}
                                    markerStyle={{
                                        height: 24,
                                        width: 24,
                                        borderRadius: 12,
                                        backgroundColor: theme.card,
                                        borderWidth: 2,
                                        borderColor: colors.primary,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 2,
                                        elevation: 3,
                                    }}
                                />
                                <View style={styles.sliderLabels}>
                                    <Text style={[styles.sliderLabelText, { color: theme.textSecondary }]}>$0</Text>
                                    <Text style={[styles.sliderLabelText, { color: theme.textSecondary }]}>$250</Text>
                                    <Text style={[styles.sliderLabelText, { color: theme.textSecondary }]}>$500</Text>
                                    <Text style={[styles.sliderLabelText, { color: theme.textSecondary }]}>$750</Text>
                                    <Text style={[styles.sliderLabelText, { color: theme.textSecondary }]}>$1000+</Text>
                                </View>
                            </View>
                        </View>

                        {/* Property Type */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Stay Type</Text>
                            <View style={styles.chipContainer}>
                                {propertyTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.chip,
                                            { backgroundColor: theme.surfaceSecondary },
                                            selectedType === type && styles.activeChip
                                        ]}
                                        onPress={() => setSelectedType(type)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            { color: theme.textSecondary },
                                            selectedType === type && styles.activeChipText
                                        ]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Verification Toggle */}
                        <View style={styles.rowSection}>
                            <View style={styles.textContainer}>
                                <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Verified only</Text>
                                <Text style={[styles.rowSubTitle, { color: theme.textSecondary }]}>Show properties verified by SomStay team</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setVerifiedOnly(!verifiedOnly)}
                                style={{
                                    width: 50,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: verifiedOnly ? colors.primary : theme.border,
                                    paddingHorizontal: 2,
                                    justifyContent: 'center',
                                    alignItems: verifiedOnly ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: theme.card }} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={[styles.resetText, { color: theme.textSecondary }]}>Clear all</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Show results</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
