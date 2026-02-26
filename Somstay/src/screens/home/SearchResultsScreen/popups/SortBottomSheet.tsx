import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './SortBottomSheet.styles';
import { colors } from '@/src/theme';

export type SortOption = 'newest' | 'price_low' | 'price_high' | 'top_rated';

interface SortBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onApply: (option: SortOption) => void;
    currentOption?: SortOption;
}

export const SortBottomSheet: React.FC<SortBottomSheetProps> = ({
    visible,
    onClose,
    onApply,
    currentOption = 'newest'
}) => {
    const [selected, setSelected] = useState<SortOption>(currentOption);

    const options = [
        { id: 'newest' as SortOption, label: 'Newest', icon: 'calendar-outline', iconType: 'ionicons' },
        { id: 'price_low' as SortOption, label: 'Price: Low to High', icon: 'trending-up', iconType: 'ionicons' },
        { id: 'price_high' as SortOption, label: 'Price: High to Low', icon: 'trending-down', iconType: 'ionicons' },
        { id: 'top_rated' as SortOption, label: 'Top Rated', icon: 'star-outline', iconType: 'ionicons' },
    ];

    const handleApply = () => {
        onApply(selected);
        onClose();
    };

    const handleReset = () => {
        setSelected('newest');
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <Text style={styles.title}>Sort By</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#9BA3A3" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionsContainer}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.optionItem,
                                    selected === option.id && styles.selectedOptionItem
                                ]}
                                onPress={() => setSelected(option.id)}
                            >
                                <View style={styles.optionLeft}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons
                                            name={option.icon as any}
                                            size={20}
                                            color={selected === option.id ? colors.primary : '#9BA3A3'}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.optionText,
                                        selected === option.id && styles.selectedOptionText
                                    ]}>
                                        {option.label}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.radioCircle,
                                    selected === option.id && styles.selectedRadioCircle
                                ]}>
                                    {selected === option.id && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <SafeAreaView edges={['bottom']}>
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                                <Text style={styles.resetText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                                <Text style={styles.applyText}>Apply Sort</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
