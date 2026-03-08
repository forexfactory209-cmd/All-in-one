import { useState, useEffect } from 'react';
import { carService } from '@/src/services/api/carService';
import { API_BASE_URL } from '@/src/services/api/endpoints';

const BASE_UPLOAD_URL = API_BASE_URL.replace('/api/v1', '');

export interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    price_per_day: number;
    transmission: string;
    seats: number;
    doors: number;
    location: string;
    description: string;
    main_image: string;
    images?: string[];
    status: string;
    rating?: number;
    reviews_count?: number;
    owner_name?: string;
    owner_phone?: string;
    owner_email?: string;
}

export const useCarDetails = (id: string) => {
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCarDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await carService.getCarById(id);
            const carData = response.data;
            
            // Fix image URLs
            const formatImage = (img: string) => 
                img && !img.startsWith('http') ? `${BASE_UPLOAD_URL}${img}` : img;

            const mappedCar: Car = {
                ...carData,
                main_image: formatImage(carData.main_image),
                images: carData.images?.map(formatImage) || []
            };

            setCar(mappedCar);
        } catch (err: any) {
            console.error('Failed to fetch car details:', err);
            setError(err.message || 'Failed to fetch car details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchCarDetails();
    }, [id]);

    return { car, loading, error, refetch: fetchCarDetails };
};
