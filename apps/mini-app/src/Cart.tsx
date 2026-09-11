import React, { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number; // Asl narxi (chegirmasiz)
  quantity: number;
}

export const Cart = ({ items, clearCart }: { items: CartItem[]; clearCart: () => void }) => {
  const [loading, setLoading] = useState(false);

  // Asl narx bo'yicha hisoblash
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    const tg = (window as any).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        items,
        total: totalAmount
      })
    });

    if (res.ok) {
      alert("Buyurtma qabul qilindi! Adminga yuborildi.");
      clearCart();
    } else {
      alert("Xatolik yuz berdi.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2>Savatcha</h2>
      {items.map((item) => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>{item.name} x {item.quantity}</span>
          <span>{(item.price * item.quantity).toLocaleString()} so'm</span>
        </div>
      ))}
      <hr />
      <h3>Jami: {totalAmount.toLocaleString()} so'm</h3>
      <button 
        onClick={handleCheckout} 
        disabled={loading || items.length === 0}
        style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', borderRadius: '8px' }}
      >
        {loading ? "Yuborilmoqda..." : "Buyurtma berish"}
      </button>
    </div>
  );
};
