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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      <div
        className="px-6 py-6 relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="transition-all duration-200 hover:opacity-80 hover:-translate-x-1">
            <ArrowLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Payment Methods</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {cards.length > 0 ? (
          <div className="space-y-4 mb-6">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <div className="flex gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-premium-sm" style={{ background: 'var(--primary-gradient)' }}>
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1" style={{ color: 'var(--foreground)' }}>
                      {getCardType(card.cardNumber)} •••• {card.cardNumber.slice(-4)}
                    </p>
                    <p style={{ color: 'var(--muted-foreground)' }}>
                      Expires {formatExpiry(card.expiryMonth, card.expiryYear)}
                    </p>
                    {card.isDefault ? (
                      <span className="inline-block mt-1 px-2 py-0.5 text-white text-xs rounded-full shadow-premium-sm" style={{ background: 'var(--primary-gradient)' }}>
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => onSetDefault(card.id)}
                        className="inline-block mt-1 px-2 py-0.5 rounded-full text-sm transition-all duration-200 hover:opacity-80"
                        style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => onEditCard(card)}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                      style={{ backgroundColor: 'var(--secondary)' }}
                    >
                      <Edit className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                    </button>
                    <button
                      onClick={() => onDeleteCard(card.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                      style={{ backgroundColor: 'var(--secondary)' }}
                    >
                      <Trash2 className="w-5 h-5" style={{ color: 'var(--destructive)' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-premium-lg" style={{ backgroundColor: 'var(--secondary)' }}>
              <CreditCard className="w-10 h-10" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
            </div>
            <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>No payment methods added</p>
            <p style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>Add a card to get started</p>
          </div>
        )}

        <button
          onClick={onAddCard}
          className="w-full p-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:border-[var(--primary)] hover:shadow-card mb-6"
          style={{ borderColor: 'var(--border)' }}
        >
          <Plus className="w-6 h-6" style={{ color: 'var(--primary)' }} />
          <span style={{ color: 'var(--foreground)' }}>Add New Card</span>
        </button>

        <div className="flex items-center justify-center gap-2 p-4 rounded-xl shadow-card" style={{ backgroundColor: 'var(--secondary)' }}>
          <Lock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <span style={{ color: 'var(--foreground)' }}>Secured by Stripe</span>
        </div>
      </div>
    </div>
  );
}
