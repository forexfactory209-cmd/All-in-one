import { useState, useEffect } from 'react';
import { Property } from '../components/ExplorePropertyCard';

const MOCK_PROPERTIES: Property[] = [
    {
        id: '1',
        title: 'Lido Beach Luxury Villa',
        location: 'Abdiaziz District, Mogadishu',
        price: '$150',
        priceLabel: '/ night',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        isVerified: true,
        isFeatured: true,
        type: 'rental',
        isFavorite: true,
    },
    {
        id: '2',
        title: 'City Center Executive Suite',
        location: 'Waberi, Mogadishu',
        price: '$85',
        priceLabel: '/ night',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        isVerified: true,
        type: 'rental',
    },
    {
        id: '3',
        title: 'Ocean View Estate',
        location: 'Hodan District, Mogadishu',
        price: '$450,000',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        isVerified: true,
        isFeatured: true,
        isForSale: true,
        type: 'sale',
    },
];

export const useExploreProperties = (filters?: any) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Mock API call simulation
        const timer = setTimeout(() => {
            let filtered = [...MOCK_PROPERTIES];

            if (filters) {
                // Filter by Destination
                if (filters.destination && filters.destination !== 'Somaliland') {
                    filtered = filtered.filter(p =>
                        p.location.toLowerCase().includes(filters.destination.toLowerCase())
                    );
                }

                // Filter by Property Type
                if (filters.propertyType && filters.propertyType !== 'All') {
                    filtered = filtered.filter(p => {
                        if (filters.propertyType === 'Real Estate') return p.type === 'sale';
                        if (filters.propertyType === 'Vacation Rental') return p.type === 'rental';
                        return true;
                    });
                }

                // Filter by Price Range
                if (filters.priceRange) {
                    const [min, max] = filters.priceRange;
                    filtered = filtered.filter(p => {
                        const priceNum = parseInt(p.price.replace(/[^0-9]/g, ''));
                        return priceNum >= min && priceNum <= max;
                    });
                }

                // Filter by Rating
                if (filters.minRating && filters.minRating !== 'All') {
                    const minRating = parseInt(filters.minRating);
                    filtered = filtered.filter(p => p.rating >= minRating);
                }
            }

            setProperties(filtered);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [JSON.stringify(filters)]);

    return { properties, loading };
};
