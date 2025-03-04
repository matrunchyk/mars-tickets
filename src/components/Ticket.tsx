import React from 'react';
import QRCode from 'react-qr-code';
import { PassengerInfo } from '../types';
import { useTranslation } from 'react-i18next';

interface TicketProps {
  passenger: PassengerInfo;
  tier: string;
}

export const Ticket: React.FC<TicketProps> = ({ passenger, tier }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4" id={`ticket-${passenger.ticketId}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-red-600">{t('header.title')}</h3>
          <p className="text-gray-600 mt-2">{tier}</p>
          <p className="text-lg font-semibold mt-4">Passenger: {passenger.name}</p>
          <p className="text-gray-500">Ticket ID: {passenger.ticketId}</p>
          
          {passenger.mealPlan && (
            <p className="text-sm text-gray-600 mt-2">
              Meal Plan: {t(`mealPlan.${passenger.mealPlan.type}.name`)}
            </p>
          )}
          
          {passenger.wifiPackage && (
            <p className="text-sm text-gray-600">
              Wi-Fi: {t(`wifi.${passenger.wifiPackage.speed}.name`)} - 
              {t(`wifi.duration.${passenger.wifiPackage.duration}`)}
            </p>
          )}
        </div>
        <div className="bg-white p-2 rounded">
          <QRCode value={passenger.ticketId} size={100} />
        </div>
      </div>
    </div>
  );
}