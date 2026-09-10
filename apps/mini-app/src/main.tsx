import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Smartfon TEGEN X1', price: 2499000 },
    { id: '2', name: 'Sport krossovka', price: 399000 },
    { id: '3', name: 'Simsiz quloqchin', price: 179000 },
    { id: '4', name: 'Kundalik ryukzak', price: 219000 },
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'cart'>('home');

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800">
      <header className="bg-white p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
            TEGEN
          </div>
          <div>
            <h1 className="font-bold text-lg">TEGEN</h1>
            <p className="text-xs text-gray-500">Onlayn do'kon</p>
          </div>
        </div>
      </header>

      {activeTab === 'home' && (
        <main className="p-4 space-y-6">
          <div className="bg-zinc-900 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">TEGEN</p>
            <h2 className="text-xl font-bold mt-1">Sifatli va hamyonbop narxlar</h2>
            <p className="text-sm text-gray-300 mt-1">Kerakli mahsulotni tez va qulay buyurtma qiling.</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Mahsulotlar</h3>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-3 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="w-full h-28 bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-gray-400 text-xs">
                    Rasm
                  </div>
                  <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                  <p className="font-bold text-base text-gray-900 mt-2">
                    {product.price.toLocaleString()} so'm
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-3 w-full bg-zinc-900 text-white py-2 rounded-xl text-sm font-medium active:scale-95 transition"
                  >
                    Savatga qo'shish
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {activeTab === 'cart' && (
        <main className="p-4">
          <h2 className="font-bold text-xl mb-4">Savat</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Savatchangiz hozircha bo'sh</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.price.toLocaleString()} so'm</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-gray-200 rounded-lg font-bold">-</button>
                    <span className="font-semibold text-sm">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-7 h-7 bg-gray-200 rounded-lg font-bold">+</button>
                  </div>
                </div>
              ))}

              <div className="bg-white p-4 rounded-xl shadow-sm mt-6 space-y-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Jami:</span>
                  <span>{totalPrice.toLocaleString()} so'm</span>
                </div>
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-center active:scale-95 transition">
                  Buyurtmani rasmiylashtirish
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around text-xs text-gray-600">
        <button onClick={() => setActiveTab('home')} className={`font-semibold ${activeTab === 'home' ? 'text-zinc-900 font-bold' : ''}`}>
          Bosh sahifa
        </button>
        <button onClick={() => setActiveTab('cart')} className={`font-semibold relative ${activeTab === 'cart' ? 'text-zinc-900 font-bold' : ''}`}>
          Savat
          {cart.length > 0 && (
            <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
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
