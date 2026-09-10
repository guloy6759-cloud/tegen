import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import logo from './logo.png';

type Product = { id:number; title:string; price:number; oldPrice?:number; emoji:string };

const categories = ['Telefonlar','Elektronika','Kiyim','Poyabzallar','Uy-ro‘zg‘or','Go‘zallik','Bolalar','Aksessuarlar'];

const products: Product[] = [
  {id:1,title:'Smartfon TEGEN X1',price:2499000,oldPrice:2899000,emoji:'📱'},
  {id:2,title:'Sport krossovka',price:399000,oldPrice:499000,emoji:'👟'},
  {id:3,title:'Simsiz quloqchin',price:179000,oldPrice:229000,emoji:'🎧'},
  {id:4,title:'Kundalik ryukzak',price:219000,emoji:'🎒'}
];

const money=(n:number)=>new Intl.NumberFormat('uz-UZ').format(n)+' so‘m';

function App(){
 const [tab,setTab]=React.useState('home');
 const [cart,setCart]=React.useState(0);
 const [search,setSearch]=React.useState('');
 const filtered=products.filter(p=>p.title.toLowerCase().includes(search.toLowerCase()));

 return <div className="app">
   <header className="top">
     <div className="brand">
       <img src={logo}/>
       <div><b>TEGEN</b><span>Onlayn do‘kon</span></div>
     </div>
     <button className="icon">♡</button>
   </header>

   {tab==='home' && <>
    <div className="search">
      <span>⌕</span>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Mahsulot va toifalarni qidirish"/>
    </div>

    <section className="hero">
      <div>
        <small>TEGEN</small>
        <h1>Hamyonbop narxlar</h1>
        <p>Kerakli mahsulotni tez va qulay buyurtma qiling.</p>
        <button>Buyurtma qilish →</button>
      </div>
      <div className="heroIcon">🛍️</div>
    </section>

    <section>
      <div className="sectionHead"><h2>Kategoriyalar</h2><span>Hammasi →</span></div>
      <div className="cats">
        {categories.map(c=>
          <button key={c}>
            <i>{c==='Telefonlar'?'📱':c==='Elektronika'?'💻':c==='Kiyim'?'👕':c==='Poyabzallar'?'👟':c==='Uy-ro‘zg‘or'?'🏠':c==='Go‘zallik'?'💄':c==='Bolalar'?'🧸':'🎒'}</i>
            {c}
          </button>
        )}
      </div>
    </section>

    <section>
      <div className="sectionHead"><h2>Hafta chegirmalari</h2><span>Hammasi →</span></div>
      <div className="products">
        {filtered.map(p=>
          <article className="card" key={p.id}>
            <div className="pic">{p.emoji}<button>♡</button></div>
            <h3>{p.title}</h3>
            <strong>{money(p.price)}</strong>
            {p.oldPrice&&<del>{money(p.oldPrice)}</del>}
            <button className="add" onClick={()=>setCart(v=>v+1)}>Savatga qo‘shish</button>
          </article>
        )}
      </div>
    </section>
   </>}

   {tab==='catalog' && <main className="empty"><div>🔎</div><h2>Katalog</h2><p>Keyingi bosqichda kategoriyalar, filtrlar va saralash ulanadi.</p></main>}

   {tab==='cart' && <main className="empty"><div>🛒</div><h2>Savat</h2><p>{cart?`${cart} ta mahsulot savatda.`:'Savat hozircha bo‘sh.'}</p></main>}

   {tab==='profile' && <main className="empty"><div>👤</div><h2>Profil</h2><p>Telegram foydalanuvchisi va buyurtmalar tarixi shu yerda bo‘ladi.</p></main>}

   <nav>
     <button className={tab==='home'?'active':''} onClick={()=>setTab('home')}>⌂<span>Bosh sahifa</span></button>
     <button className={tab==='catalog'?'active':''} onClick={()=>setTab('catalog')}>⌕<span>Katalog</span></button>
     <button className={tab==='cart'?'active':''} onClick={()=>setTab('cart')}>🛍<span>Savat {cart?`(${cart})`:''}</span></button>
     <button className={tab==='profile'?'active':''} onClick={()=>setTab('profile')}>♙<span>Profil</span></button>
   </nav>
 </div>
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App/></React.StrictMode>
);
