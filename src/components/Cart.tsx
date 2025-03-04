import React from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem, PassengerInfo, MealPlan, WifiPackage } from '../types';
import { X } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  onUpdatePassenger: (tier: string, index: number, updates: Partial<PassengerInfo>) => void;
  onCheckout: () => void;
  onClose: () => void;
  show: boolean;
}

const MEAL_PLANS: MealPlan[] = [
  { type: 'standard', price: 500 },
  { type: 'vegetarian', price: 600 },
  { type: 'premium', price: 1000 }
];

const WIFI_PACKAGES: { speed: WifiPackage['speed']; durations: WifiPackage['duration'][]; basePrice: number }[] = [
  { speed: 'basic', durations: ['1-month', '3-months', '6-months'], basePrice: 50 },
  { speed: 'high-speed', durations: ['1-month', '3-months', '6-months'], basePrice: 100 },
  { speed: 'ultra', durations: ['1-month', '3-months', '6-months'], basePrice: 200 }
];

export const Cart: React.FC<CartProps> = ({ items, onUpdatePassenger, onCheckout, onClose, show }) => {
  const { t } = useTranslation();

  if (!show) return null;

  const calculateWifiPrice = (speed: WifiPackage['speed'], duration: WifiPackage['duration']) => {
    const basePrice = WIFI_PACKAGES.find(p => p.speed === speed)?.basePrice || 0;
    const durationMultiplier = duration === '1-month' ? 1 : duration === '3-months' ? 2.5 : 5;
    return basePrice * durationMultiplier;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{t('cart.title')}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          {items.map((item, idx) => (
            <div key={idx} className="mb-6 border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{item.tier}</span>
                <span>Quantity: {item.quantity}</span>
              </div>
              
              {item.passengers.map((passenger, index) => (
                <div key={index} className="mb-4 bg-gray-50 p-4 rounded">
                  <input
                    type="text"
                    placeholder={t('cart.passenger', { number: index + 1 })}
                    value={passenger.name}
                    onChange={(e) => onUpdatePassenger(item.tier, index, { name: e.target.value })}
                    className="w-full border rounded p-2 mb-3"
                  />
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">{t('mealPlan.title')}</label>
                    <select
                      value={passenger.mealPlan?.type || ''}
                      onChange={(e) => onUpdatePassenger(item.tier, index, {
                        mealPlan: e.target.value ? {
                          type: e.target.value as MealPlan['type'],
                          price: MEAL_PLANS.find(p => p.type === e.target.value)?.price || 0
                        } : undefined
                      })}
                      className="w-full border rounded p-2"
                    >
                      <option value="">{t('mealPlan.select')}</option>
                      {MEAL_PLANS.map(plan => (
                        <option key={plan.type} value={plan.type}>
                          {t(`mealPlan.${plan.type}.name`)} - ${plan.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('wifi.title')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={passenger.wifiPackage?.speed || ''}
                        onChange={(e) => {
                          const speed = e.target.value as WifiPackage['speed'];
                          const duration = passenger.wifiPackage?.duration || '1-month';
                          onUpdatePassenger(item.tier, index, {
                            wifiPackage: speed ? {
                              speed,
                              duration,
                              price: calculateWifiPrice(speed, duration)
                            } : undefined
                          });
                        }}
                        className="border rounded p-2"
                      >
                        <option value="">{t('wifi.select')}</option>
                        {WIFI_PACKAGES.map(pkg => (
                          <option key={pkg.speed} value={pkg.speed}>
                            {t(`wifi.${pkg.speed}.name`)}
                          </option>
                        ))}
                      </select>

                      {passenger.wifiPackage?.speed && (
                        <select
                          value={passenger.wifiPackage.duration}
                          onChange={(e) => {
                            const duration = e.target.value as WifiPackage['duration'];
                            onUpdatePassenger(item.tier, index, {
                              wifiPackage: {
                                ...passenger.wifiPackage!,
                                duration,
                                price: calculateWifiPrice(passenger.wifiPackage!.speed, duration)
                              }
                            });
                          }}
                          className="border rounded p-2"
                        >
                          {WIFI_PACKAGES[0].durations.map(duration => (
                            <option key={duration} value={duration}>
                              {t(`wifi.duration.${duration}`)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          {items.length > 0 && (
            <button
              onClick={onCheckout}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('cart.checkout')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}