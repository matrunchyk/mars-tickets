import React, { useState } from 'react';
import { Ticket, CartItem, PassengerInfo } from './types';
import { TicketCard } from './components/TicketCard';
import { Cart } from './components/Cart';
import { CartIcon } from './components/CartIcon';
import { Ticket as TicketComponent } from './components/Ticket';
import { Rocket } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';

const TICKETS: Ticket[] = [
  {
    tier: "Red Planet Pioneer",
    price: 250000,
    description: "Experience the first wave of Mars colonization with our entry-level package.",
    features: [
      "Basic life support systems",
      "Shared living quarters",
      "Basic Mars exploration gear",
      "Emergency return insurance"
    ],
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80"
  },
  {
    tier: "Martian Elite",
    price: 500000,
    description: "Premium comfort and exclusive access to advanced Mars facilities.",
    features: [
      "Enhanced life support systems",
      "Private living pod",
      "Advanced exploration equipment",
      "Priority medical care",
      "Exclusive facility access"
    ],
    image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&q=80"
  },
  {
    tier: "Olympus Prime",
    price: 1000000,
    description: "The ultimate luxury Mars experience with unparalleled amenities.",
    features: [
      "State-of-the-art life support",
      "Luxury habitat suite",
      "Personal transport vehicle",
      "24/7 concierge service",
      "Private research lab access",
      "First-class return journey"
    ],
    image: "https://images.unsplash.com/photo-1614726365952-510103b1bbb4?auto=format&fit=crop&q=80"
  }
];

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tickets, setTickets] = useState<PassengerInfo[]>([]);
  const { t } = useTranslation();

  const handleAddToCart = (tier: string) => {
    const existingItem = cart.find(item => item.tier === tier);
    if (existingItem && existingItem.quantity >= 10) {
      alert('Maximum 10 tickets per tier allowed');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.tier === tier);
      if (existing) {
        return prev.map(item =>
          item.tier === tier
            ? { ...item, quantity: item.quantity + 1, passengers: [...item.passengers, { name: '', ticketId: '' }] }
            : item
        );
      }
      return [...prev, { tier, quantity: 1, passengers: [{ name: '', ticketId: '' }] }];
    });
  };

  const handleUpdatePassenger = (tier: string, index: number, updates: Partial<PassengerInfo>) => {
    setCart(prev =>
      prev.map(item =>
        item.tier === tier
          ? {
              ...item,
              passengers: item.passengers.map((p, i) =>
                i === index ? { ...p, ...updates } : p
              )
            }
          : item
      )
    );
  };

  const generateTicketId = () => {
    return `MARS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleCheckout = () => {
    const allValid = cart.every(item =>
      item.passengers.every(p => p.name.trim() !== '')
    );

    if (!allValid) {
      alert('Please enter names for all passengers');
      return;
    }

    const generatedTickets = cart.flatMap(item =>
      item.passengers.map(p => ({
        ...p,
        ticketId: generateTicketId(),
        tier: item.tier
      }))
    );

    setTickets(generatedTickets);
    setShowConfirmation(true);
    setShowCart(false);
  };

  const downloadTickets = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let currentY = 10;

    for (const ticket of tickets) {
      const element = document.getElementById(`ticket-${ticket.ticketId}`);
      if (element) {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        
        if (currentY + 80 > pdf.internal.pageSize.height) {
          pdf.addPage();
          currentY = 10;
        }

        pdf.addImage(imgData, 'PNG', 10, currentY, 190, 60);
        currentY += 70;
      }
    }

    pdf.save('mars-tickets.pdf');
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('header.title')}</h1>
            <button
              onClick={downloadTickets}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Download Tickets
            </button>
          </div>
          {tickets.map((ticket) => (
            <TicketComponent
              key={ticket.ticketId}
              passenger={ticket}
              tier={ticket.tier}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <Rocket size={32} />
            <h1 className="text-4xl font-bold">{t('header.title')}</h1>
          </div>
          <p className="mt-2 text-xl">{t('header.subtitle')}</p>
        </div>
      </header>

      <CartIcon itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onClick={() => setShowCart(true)} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TICKETS.map((ticket) => (
            <TicketCard
              key={ticket.tier}
              ticket={ticket}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>

      <Cart
        items={cart}
        onUpdatePassenger={handleUpdatePassenger}
        onCheckout={handleCheckout}
        onClose={() => setShowCart(false)}
        show={showCart}
      />
    </div>
  );
}

export default App;