import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSavedCards, removeSavedCard, SavedCardResponse } from '@shared/services/user-service';
import { sumitService } from '@shared/services/sumit-service';
import { SavedCard } from '@features/entities/items/components/SavedCards';

/**
 * Transform backend response to frontend SavedCard format
 */
const transformToSavedCard = (card: SavedCardResponse): SavedCard => ({
  id: card.id,
  last4: card.last4,
  brand: card.brand as 'visa' | 'mastercard' | 'amex',
  expiryMonth: '', // Not stored currently - could be added later
  expiryYear: ''
});

/**
 * Hook to fetch user's saved cards (for logged-in users)
 */
export const useSavedCards = (userId: string | undefined) => {
  return useQuery<SavedCard[]>({
    queryKey: ['savedCards', userId],
    queryFn: async () => {
      if (!userId) return [];
      const cards = await getSavedCards(userId);
      return cards.map(transformToSavedCard);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch saved card by phone number (for non-logged-in users)
 * Returns the saved card if found, or empty array if not
 */
export const useSavedCardsByPhone = (phone: string | undefined) => {
  return useQuery<SavedCard[]>({
    queryKey: ['savedCardsByPhone', phone],
    queryFn: async () => {
      if (!phone) return [];
      const result = await sumitService.getSavedCardByPhone(phone);
      if (!result) return [];
      
      return [{
        id: result.customerId, // Use customerId as the card identifier
        last4: result.card.last4,
        brand: result.card.brand as 'visa' | 'mastercard' | 'amex',
        expiryMonth: result.card.expirationMonth?.toString() || '',
        expiryYear: result.card.expirationYear?.toString() || ''
      }];
    },
    enabled: !!phone && phone.length >= 9, // Only query if phone has at least 9 digits
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to remove user's saved card
 */
export const useRemoveSavedCardMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User ID required');
      return removeSavedCard(userId);
    },
    onSuccess: () => {
      // Invalidate saved cards query to refetch
      queryClient.invalidateQueries({ queryKey: ['savedCards', userId] });
    }
  });
};
