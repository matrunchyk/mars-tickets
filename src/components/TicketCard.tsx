import React from 'react';
import { Rocket, Check } from 'lucide-react';
import { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onAddToCart: (tier: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:scale-105">
      <div className="h-48 overflow-hidden">
        <img src={ticket.image} alt={ticket.tier} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="text-red-600" size={24} />
          <h3 className="text-2xl font-bold text-gray-800">{ticket.tier}</h3>
        </div>
        <p className="text-gray-600 mb-4">{ticket.description}</p>
        <div className="mb-6">
          {ticket.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-700 mb-2">
              <Check size={16} className="text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-red-600">${ticket.price.toLocaleString()}</span>
          <button
            onClick={() => onAddToCart(ticket.tier)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}