import { useState } from 'react';
import reviewService, { CreateReviewData, EntityType } from '@/src/services/review/reviewService';
import { Alert } from 'react-native';

interface UseWriteReviewOptions {
    entityType:  EntityType;
    entityId:    number;
    bookingId?:  number;
    onSuccess?:  () => void;
}

export const useWriteReview = ({ entityType, entityId, bookingId, onSuccess }: UseWriteReviewOptions) => {
    const [rating,       setRating]       = useState<number>(0);
    const [title,        setTitle]        = useState<string>('');
    const [body,         setBody]         = useState<string>('');
    const [cleanliness,  setCleanliness]  = useState<number>(0);
    const [service,      setService]      = useState<number>(0);
    const [value,        setValue]        = useState<number>(0);
    const [locationRate, setLocationRate] = useState<number>(0);
    const [submitting,   setSubmitting]   = useState(false);
    const [error,        setError]        = useState<string | null>(null);

    const isValid = rating >= 1 && rating <= 5;

    const submit = async () => {
        if (!isValid) {
            setError('Please select a rating before submitting.');
            return;
        }

        setSubmitting(true);
        setError(null);

        const data: CreateReviewData = {
            entity_type:  entityType,
            entity_id:    entityId,
            booking_id:   bookingId,
            rating,
            title:        title.trim() || undefined,
            body:         body.trim()  || undefined,
            cleanliness:  cleanliness  || undefined,
            service:      service      || undefined,
            value:        value        || undefined,
            location:     locationRate || undefined,
        };

        try {
            await reviewService.createReview(data);
            Alert.alert('🎉 Thank you!', 'Your review has been submitted.');
            onSuccess?.();
        } catch (e: any) {
            const msg = e?.response?.data?.message || e.message || 'Submission failed.';
            setError(msg);
            Alert.alert('Error', msg);
        } finally {
            setSubmitting(false);
        }
    };

    return {
        rating, setRating,
        title, setTitle,
        body, setBody,
        cleanliness, setCleanliness,
        service, setService,
        value, setValue,
        locationRate, setLocationRate,
        submitting, error, isValid, submit,
    };
};
