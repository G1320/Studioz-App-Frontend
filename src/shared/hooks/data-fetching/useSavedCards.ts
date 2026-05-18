import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSavedCards, removeSavedCard, setDefaultCard, SavedCardResponse } from '@shared/services/user-service';
import { sumitService } from '@shared/services/sumit-service';
import { SavedCard } from '@features/entities/items/components/SavedCards';

const transformToSavedCard = (card: SavedCardResponse): SavedCard => ({
  id: card.id,
  last4: card.last4,
  brand: card.brand as 'visa' | 'mastercard' | 'amex',
  expiryMonth: card.expirationMonth?.toString() || '',
  expiryYear: card.expirationYear?.toString() || '',
  isDefault: card.isDefault,
});

export const useSavedCards = (userId: string | undefined) => {
  return useQuery<SavedCard[]>({
    queryKey: ['savedCards', userId],
    queryFn: async () => {
      if (!userId) return [];
      const cards = await getSavedCards(userId);
      return cards.map(transformToSavedCard);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSavedCardsByPhone = (phone: string | undefined) => {
  return useQuery<SavedCard[]>({
    queryKey: ['savedCardsByPhone', phone],
    queryFn: async () => {
      if (!phone) return [];
      const result = await sumitService.getSavedCardByPhone(phone);
      if (!result) return [];
      
      return [{
        id: result.customerId,
        last4: result.card.last4,
        brand: result.card.brand as 'visa' | 'mastercard' | 'amex',
        expiryMonth: result.card.expirationMonth?.toString() || '',
        expiryYear: result.card.expirationYear?.toString() || '',
      }];
    },
    enabled: !!phone && phone.length >= 9,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRemoveSavedCardMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId?: string) => {
      if (!userId) throw new Error('User ID required');
      return removeSavedCard(userId, cardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedCards', userId] });
    }
  });
};

export const useSetDefaultCardMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId: string) => {
      if (!userId) throw new Error('User ID required');
      return setDefaultCard(userId, cardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedCards', userId] });
    }
  });
};
