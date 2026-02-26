export interface PropertyResponse {
    id: string;
    title: string;
    description?: string;
    property_type?: string;
    city: string;
    country: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    price_per_night: number;
    bedrooms?: number;
    bathrooms?: number;
    max_guests?: number;
    average_rating?: number;
    review_count?: number;
    photos?: Array<{
        id?: string;
        photo_url: string;
    }>;
    amenities?: string[];
    owner?: {
        id: string;
        name: string;
        avatar?: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface CreatePropertyRequest {
    title: string;
    description: string;
    property_type: string;
    city: string;
    country: string;
    address: string;
    price_per_night: number;
    bedrooms: number;
    bathrooms: number;
    max_guests: number;
}

export interface PropertyFilters {
    location?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    property_type?: string;
    amenities?: string[];
}
