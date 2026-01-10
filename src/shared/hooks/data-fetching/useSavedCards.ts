import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSavedCards, removeSavedCard, SavedCardResponse } from '@shared/services/user-service';
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
 * Hook to fetch user's saved cards
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
