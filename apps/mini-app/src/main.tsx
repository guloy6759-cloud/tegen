import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import logo from './logo.png';

type Product = {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
};

type Order = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  user?: {
    firstName?: string;
    phone?: string;
    telegramId?: string | number;
  };
};

const categories = [
  'Telefonlar',
  'Elektronika',
  'Kiyim',
  'Poyabzallar',
  'Uy-ro‘zg‘or',
  'Go‘zallik',
  'Bolalar',
  'Aksessuarlar',
];

const products = [
  {
    id: 1,
    title: 'Smartfon TEGEN X1',
    price: 2499000,
    oldPrice: 2899000,
    emoji: '📱',
  },
  {
    id: 2,
    title: 'Sport krossovka',
    price: 399000,
    oldPrice: 499000,
    emoji: '👟',
  },
  {
    id: 3,
    title: 'Simsiz quloqchin',
    price: 179000,
    oldPrice: 229000,
    emoji: '🎧',
  },
  {
    id: 4,
    title: 'Kundalik ryukzak',
    price: 219000,
    emoji: '🎒',
  },
];

const money = (n: number) =>
  new Intl.NumberFormat('uz-UZ').format(n) + ' so‘m';

const API_URL = import.meta.env.VITE_API_URL || '';

function StoreApp() {
  const [tab, setTab] = React.useState('home');
  const [cart, setCart] = React.useState(0);
  const [search, setSearch] = React.useState('');

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <img src={logo} />
          <div>
            <b>TEGEN</b>
            <span>Onlayn do‘kon</span>
          </div>
        </div>

        <button className="icon">♡</button>
      </header>

      {tab === 'home' && (
        <>
          <div className="search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mahsulot va toifalarni qidirish"
            />
          </div>

          <section className="hero">
            <div>
              <small>TEGEN</small>
              <h1>Hamyonbop narxlar</h1>
              <p>
                Kerakli mahsulotni tez va qulay buyurtma qiling.
              </p>
              <button>Buyurtma qilish →</button>
            </div>

            <div className="heroIcon">🛍️</div>
          </section>

          <section>
            <div className="sectionHead">
              <h2>Kategoriyalar</h2>
              <span>Hammasi →</span>
            </div>

            <div className="cats">
              {categories.map((c) => (
                <button key={c}>
                  <i>
                    {c === 'Telefonlar'
                      ? '📱'
                      : c === 'Elektronika'
                        ? '💻'
                        : c === 'Kiyim'
                          ? '👕'
                          : c === 'Poyabzallar'
                            ? '👟'
                            : c === 'Uy-ro‘zg‘or'
                              ? '🏠'
                              : c === 'Go‘zallik'
                                ? '💄'
                                : c === 'Bolalar'
                                  ? '🧸'
                                  : '🎒'}
                  </i>
                  {c}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="sectionHead">
              <h2>Hafta chegirmalari</h2>
              <span>Hammasi →</span>
            </div>

            <div className="products">
              {filtered.map((p) => (
                <article className="card" key={p.id}>
                  <div className="pic">
                    {p.emoji}
                    <button>♡</button>
                  </div>

                  <h3>{p.title}</h3>

                  <strong>{money(p.price)}</strong>

                  {p.oldPrice && <del>{money(p.oldPrice)}</del>}

                  <button
                    className="add"
                    onClick={() => setCart((v) => v + 1)}
                  >
                    Savatga qo‘shish
                  </button>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === 'catalog' && (
        <main className="empty">
          <div>🔎</div>
          <h2>Katalog</h2>
          <p>
            Keyingi bosqichda kategoriyalar, filtrlar va saralash
            ulanadi.
          </p>
        </main>
      )}

      {tab === 'cart' && (
        <main className="empty">
          <div>🛒</div>
          <h2>Savat</h2>
          <p>
            {cart
              ? `${cart} ta mahsulot savatda.`
              : 'Savat hozircha bo‘sh.'}
          </p>
        </main>
      )}

      {tab === 'profile' && (
        <main className="empty">
          <div>👤</div>
          <h2>Profil</h2>
          <p>
            Telegram foydalanuvchisi va buyurtmalar tarixi shu yerda
            bo‘ladi.
          </p>
        </main>
      )}

      <nav>
        <button
          className={tab === 'home' ? 'active' : ''}
          onClick={() => setTab('home')}
        >
          ⌂
          <span>Bosh sahifa</span>
        </button>

        <button
          className={tab === 'catalog' ? 'active' : ''}
          onClick={() => setTab('catalog')}
        >
          ⌕
          <span>Katalog</span>
        </button>

        <button
          className={tab === 'cart' ? 'active' : ''}
          onClick={() => setTab('cart')}
        >
          🛍
          <span>Savat {cart ? `(${cart})` : ''}</span>
        </button>

        <button
          className={tab === 'profile' ? 'active' : ''}
          onClick={() => setTab('profile')}
        >
          ♙
          <span>Profil</span>
        </button>
      </nav>
    </div>
  );
}

function AdminApp() {
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [logged, setLogged] = React.useState(
    localStorage.getItem('tegen_admin') === 'true',
  );

  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [message, setMessage] = React.useState('');

  async function loadData() {
    if (!API_URL) {
      setMessage('API URL ulanmagan.');
      return;
    }

    try {
      const [p, o] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/orders`),
      ]);

      if (!p.ok || !o.ok) {
        throw new Error('API xatosi');
      }

      setProducts(await p.json());
      setOrders(await o.json());
      setMessage('');
    } catch {
      setMessage('Server bilan bog‘lanib bo‘lmadi.');
    }
  }

  function doLogin() {
    if (login === 'admin' && password === '123456') {
      localStorage.setItem('tegen_admin', 'true');
      setLogged(true);
      setMessage('');
    } else {
      setMessage('Login yoki parol noto‘g‘ri.');
    }
  }

  function logout() {
    localStorage.removeItem('tegen_admin');
    setLogged(false);
  }

  async function updateOrder(id: number, status: string) {
    if (!API_URL) return;

    try {
      await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      await loadData();
    } catch {
      setMessage('Buyurtma statusini o‘zgartirib bo‘lmadi.');
    }
  }

  React.useEffect(() => {
    if (logged) {
      loadData();
    }
  }, [logged]);

  if (!logged) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f5f6fa',
          padding: 20,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 400,
            margin: '80px auto',
            background: '#fff',
            padding: 30,
            borderRadius: 16,
          }}
        >
          <h2>🛒 TEGEN Admin</h2>

          <input
            style={adminInput}
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <input
            style={adminInput}
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={adminButton} onClick={doLogin}>
            Kirish
          </button>

          {message && (
            <p style={{ color: '#dc2626' }}>{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f6fa',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <header
        style={{
          background: '#111827',
          color: '#fff',
          padding: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <b>🛒 TEGEN ADMIN</b>

        <button
          style={{
            ...adminButton,
            background: '#dc2626',
            width: 'auto',
          }}
          onClick={logout}
        >
          Chiqish
        </button>
      </header>

      <main style={{ maxWidth: 1100, margin: '25px auto', padding: 15 }}>
        {message && (
          <div
            style={{
              background: '#fff3cd',
              padding: 15,
              borderRadius: 10,
              marginBottom: 15,
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(180px,1fr))',
            gap: 15,
          }}
        >
          <div style={adminCard}>
            <b>Mahsulotlar</b>
            <h1>{products.length}</h1>
          </div>

          <div style={adminCard}>
            <b>Faol mahsulotlar</b>
            <h1>{products.filter((p) => p.isActive).length}</h1>
          </div>

          <div style={adminCard}>
            <b>Buyurtmalar</b>
            <h1>{orders.length}</h1>
          </div>
        </div>

        <section style={adminSection}>
          <h2>Buyurtmalar</h2>

          <button style={adminButton} onClick={loadData}>
            🔄 Yangilash
          </button>

          {orders.length === 0 ? (
            <p>Hozircha buyurtmalar yo‘q.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                style={{
                  padding: 15,
                  borderBottom: '1px solid #eee',
                }}
              >
                <b>Buyurtma #{order.id}</b>

                <p>
                  Mijoz:{' '}
                  {order.user?.firstName || 'Noma’lum'}
                </p>

                <p>
                  Telefon:{' '}
                  {order.user?.phone || 'Ko‘rsatilmagan'}
                </p>

                <p>
                  Summa: <b>{money(order.total)}</b>
                </p>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrder(order.id, e.target.value)
                  }
                  style={adminInput}
                >
                  <option value="NEW">Yangi</option>
                  <option value="ACCEPTED">Qabul qilindi</option>
                  <option value="PREPARING">Tayyorlanmoqda</option>
                  <option value="READY">Tayyor</option>
                  <option value="DELIVERING">Yetkazilmoqda</option>
                  <option value="COMPLETED">Yakunlandi</option>
                  <option value="REJECTED">Rad etildi</option>
                  <option value="CANCELLED">Bekor qilindi</option>
                </select>
              </div>
            ))
          )}
        </section>

        <section style={adminSection}>
          <h2>Mahsulotlar</h2>

          {products.length === 0 ? (
            <p>Mahsulotlar yo‘q.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  padding: 12,
                  borderBottom: '1px solid #eee',
                }}
              >
                <b>#{product.id} — {product.name}</b>
                <br />
                {money(product.price)}
                <br />
                {product.isActive ? '✅ Faol' : '❌ Nofaol'}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

const adminInput: React.CSSProperties = {
  width: '100%',
  padding: 12,
  margin: '7px 0',
  border: '1px solid #ddd',
  borderRadius: 8,
  fontSize: 15,
};

const adminButton: React.CSSProperties = {
  width: '100%',
  padding: 12,
  border: 0,
  borderRadius: 8,
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
};

const adminCard: React.CSSProperties = {
  background: '#fff',
  padding: 20,
  borderRadius: 14,
  boxShadow: '0 3px 15px rgba(0,0,0,.06)',
};

const adminSection: React.CSSProperties = {
  background: '#fff',
  padding: 20,
  borderRadius: 14,
  marginTop: 20,
};

const isAdmin =
  window.location.pathname === '/admin' ||
  window.location.hash === '#admin';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAdmin ? <AdminApp /> : <StoreApp />}
  </React.StrictMode>,
);
