import { ArrowLeft, CreditCard, Edit, Trash2, Plus, Lock } from 'lucide-react';
import { CardData } from './AddPaymentCardScreen';

interface PaymentMethodsScreenProps {
  onBack: () => void;
  onAddCard: () => void;
  cards: CardData[];
  onEditCard: (card: CardData) => void;
  onDeleteCard: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export function PaymentMethodsScreen({ 
  onBack, 
  onAddCard, 
  cards,
  onEditCard,
  onDeleteCard,
  onSetDefault
}: PaymentMethodsScreenProps) {
  const getCardType = (number: string) => {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'Amex';
    return 'Card';
  };

  const formatExpiry = (month: string, year: string) => {
    return `${month.padStart(2, '0')}/${year}`;
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Payment Methods</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {cards.length > 0 ? (
          <div className="space-y-4 mb-6">
            {cards.map((card) => (
              <div key={card.id} className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="flex gap-4 mb-3">
                  <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">
                      {getCardType(card.cardNumber)} •••• {card.cardNumber.slice(-4)}
                    </p>
                    <p className="text-gray-600">
                      Expires {formatExpiry(card.expiryMonth, card.expiryYear)}
                    </p>
                    {card.isDefault ? (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-800 text-white rounded-full">
                        Default
                      </span>
                    ) : (
                      <button 
                        onClick={() => onSetDefault(card.id)}
                        className="inline-block mt-1 px-2 py-0.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button 
                      onClick={() => onEditCard(card)}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => onDeleteCard(card.id)}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Trash2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No payment methods added</p>
            <p className="text-gray-400">Add a card to get started</p>
          </div>
        )}

        <button 
          onClick={onAddCard}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:border-gray-800 mb-6"
        >
          <Plus className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700">Add New Card</span>
        </button>

        <div className="flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg">
          <Lock className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Secured by Stripe</span>
        </div>
      </div>
    </div>
  );
}