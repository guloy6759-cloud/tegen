import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const tg = (window as any).Telegram?.WebApp;

function App() {
  const user = tg?.initDataUnsafe?.user;

  React.useEffect(() => {
    tg?.ready();
    tg?.expand();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <img src="/logo.png" alt="Tegen" className="logo" />

        <div>
          <h1>Tegen</h1>
          <p>Onlayn do‘kon</p>
        </div>
      </header>

      <main>
        <section className="welcome">
          <h2>
            Assalomu alaykum
            {user?.first_name ? `, ${user.first_name}` : ''}! 👋
          </h2>

          <p>
            Tegen do‘koniga xush kelibsiz.
          </p>
        </section>

        <section className="products">
          <h2>Mahsulotlar</h2>

          <div className="empty">
            <div className="empty-icon">🛍️</div>

            <h3>Mahsulotlar tez orada</h3>

            <p>
              Hozircha mahsulotlar qo‘shilmagan.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
