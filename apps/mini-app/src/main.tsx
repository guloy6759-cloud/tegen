import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

interface Product {
  id: string;
  name: string;
  price: number;
  icon: string;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Smartfon TEGEN X1', price: 2499000, icon: '📱' },
    { id: '2', name: 'Sport krossovka', price: 399000, icon: '👟' },
    { id: '3', name: 'Simsiz quloqchin', price: 179000, icon: '🎧' },
    { id: '4', name: 'Kundalik ryukzak', price: 219000, icon: '🎒' },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'cart'>('home');

  const tg = (window as any).Telegram?.WebApp;
  const telegramId = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : "12345678";

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submitOrder = async () => {
    if (cart.length === 0) return;

    try {
      const response = await fetch('https://tegenserver-production.up.railway.app/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId,
          items: cart,
          totalPrice,
        }),
      });

      if (response.ok) {
        alert("Buyurtmangiz qabul qilindi! Operatorlarimiz tez orada bog'lanishadi.");
        setCart([]);
        setActiveTab('home');
      } else {
        alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
      }
    } catch (error) {
      console.error(error);
      alert("Server bilan aloqa yo'q.");
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px', color: '#0f172a' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#ffffff', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '12px' }}>
            TEGEN
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>TEGEN</h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Onlayn do'kon</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {activeTab === 'home' && (
        <main style={{ padding: '16px' }}>
          <div style={{ backgroundColor: '#09090b', color: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#a1a1aa', fontWeight: '600', letterSpacing: '1px' }}>TEGEN</p>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 'bold' }}>Sifatli va hamyonbop narxlar</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#d4d4d8' }}>Kerakli mahsulotni tez va qulay buyurtma qiling.</p>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Mahsulotlar</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {products.map((product) => (
              <div key={product.id} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ width: '100%', height: '110px', backgroundColor: '#f1f5f9', borderRadius: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                  {product.icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{product.name}</h4>
                  <p style={{ margin: '6px 0 12px 0', fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>
                    {product.price.toLocaleString()} so'm
                  </p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  style={{ width: '100%', backgroundColor: '#09090b', color: '#ffffff', border: 'none', padding: '10px 0', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Savatga qo'shish
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Cart Tab */}
      {activeTab === 'cart' && (
        <main style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Savat</h2>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>Savatchangiz hozircha bo'sh</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} style={{ backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{item.name}</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>{item.price.toLocaleString()} so'm</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => removeFromCart(item.id)} style={{ width: '28px', height: '28px', border: 'none', backgroundColor: '#f1f5f9', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.quantity}</span>
                    <button onClick={() => addToCart(item)} style={{ width: '28px', height: '28px', border: 'none', backgroundColor: '#f1f5f9', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              ))}

              <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '16px', marginTop: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>
                  <span>Jami:</span>
                  <span>{totalPrice.toLocaleString()} so'm</span>
                </div>
                <button
                  onClick={submitOrder}
                  style={{ width: '100%', backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '14px 0', borderRadius: '14px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Buyurtmani rasmiylashtirish
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '12px', display: 'flex', justifyContent: 'space-around', fontSize: '12px' }}>
        <button
          onClick={() => setActiveTab('home')}
          style={{ border: 'none', background: 'none', fontWeight: activeTab === 'home' ? 'bold' : 'normal', color: activeTab === 'home' ? '#09090b' : '#64748b', cursor: 'pointer' }}
        >
          🏠 Bosh sahifa
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          style={{ border: 'none', background: 'none', fontWeight: activeTab === 'cart' ? 'bold' : 'normal', color: activeTab === 'cart' ? '#09090b' : '#64748b', cursor: 'pointer', position: 'relative' }}
        >
          🛒 Savat {cart.length > 0 && `(${cart.reduce((a, b) => a + b.quantity, 0)})`}
        </button>
      </nav>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
        
