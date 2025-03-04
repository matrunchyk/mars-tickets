import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CartIconProps {
  itemCount: number;
  onClick: () => void;
}

export const CartIcon: React.FC<CartIconProps> = ({ itemCount, onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      aria-label={t('cart.title')}
    >
      <div className="relative">
        <ShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </span>
        )}
      </div>
    </button>
  );
}