'use client';

import type { CSSProperties, FormEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

const EVENT_DATE = new Date('2026-11-14T11:00:00-06:00').getTime();

const places = [
  {
    icon: '✝',
    label: 'Ceremonia · 11:00 a. m.',
    name: 'Parroquia Nuestra Señora de la Paz',
    address: 'Av. Principal 123, Col. Centro',
    map: 'https://www.google.com/maps/search/?api=1&query=Parroquia+Nuestra+Señora+de+la+Paz',
  },
  {
    icon: '♕',
    label: 'Recepción · 1:00 p. m.',
    name: 'Jardín Las Rosas',
    address: 'Calle del Lago 45, Col. Jardines',
    map: 'https://www.google.com/maps/search/?api=1&query=Jardin+Las+Rosas',
  },
];

const godparents = [
  {
    icon: "🤍",
    role: "Padrinos de bautizo",
    name: "Juan Pérez & María López"
  },
  {
    icon: "✨",
    role: "Padrinos de vela",
    name: "Carlos & Fernanda"
  }
];
const myParents = [
  {
    icon: "🤵🏻",
    role: "Padre",
    name: "Juan Pérez Lagos"
  },
  {
    icon: "👸🏻",
    role: "Mamá",
    name: "Fernanda Juarez"
  }
];
function getCountdown() {
  const difference = Math.max(0, EVENT_DATE - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
  };
}

export default function Home() {
  const [coverStage, setCoverStage] = useState<'closed' | 'opening' | 'open'>('closed');
  const [showOpeningCat, setShowOpeningCat] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [wishName, setWishName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [notice, setNotice] = useState('');
  const detailsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdown());
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (coverStage !== 'open') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.16 },
    );
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [coverStage]);

  const openCover = () => {
    if (coverStage === 'closed') setCoverStage('opening');
  };

  const handleCoverTilt = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch' || coverStage !== 'closed') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--cover-rx', `${(-y * 5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--cover-ry', `${(x * 5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--cover-glow-x', `${((x + 0.5) * 100).toFixed(0)}%`);
    event.currentTarget.style.setProperty('--cover-glow-y', `${((y + 0.5) * 100).toFixed(0)}%`);
  };

  const resetCoverTilt = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty('--cover-rx', '0deg');
    event.currentTarget.style.setProperty('--cover-ry', '0deg');
  };

  const shareInvitation = () => {
    const message = `Acompáñanos a celebrar el bautizo de Valentina.\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const sendWish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = `Un deseo para Valentina ♡\n${wishName || 'Un invitado'}: ${wishMessage || 'Que Dios te bendiga siempre.'}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setNotice('Tu mensaje está listo en WhatsApp');
  };

  return (
    <main className={`invite-page ${coverStage === 'open' ? 'cover-is-open' : ''}`}>
      <div className="page-ambient ambient-left" aria-hidden="true" />
      <div className="page-ambient ambient-right" aria-hidden="true" />
      <div className="floating-sparkles" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={index}
            style={{
              '--x': `${2 + index * 7.2}%`,
              '--y': `${8 + ((index * 17) % 78)}%`,
              '--sparkle-delay': `${index * -0.55}s`,
            } as CSSProperties}
          >
            {index % 3 === 0 ? '♡' : index % 2 === 0 ? '✦' : '·'}
          </span>
        ))}
      </div>

      {coverStage !== 'open' && (
        <div className={`cover-overlay ${coverStage === 'opening' ? 'cover-opening' : ''}`}>
          <button
            type="button"
            className="digital-cover"
            onClick={openCover}
            onPointerMove={handleCoverTilt}
            onPointerLeave={resetCoverTilt}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget && coverStage === 'opening') setCoverStage('open');
            }}
            aria-label="Abrir la invitación de mi bautizo"
          >
            <span className="cover-corner corner-top-left" aria-hidden="true" />
            <span className="cover-corner corner-top-right" aria-hidden="true" />
            <span className="cover-corner corner-bottom-left" aria-hidden="true" />
            <span className="cover-corner corner-bottom-right" aria-hidden="true" />
            <span className="cover-light" aria-hidden="true" />

            <span className="cover-image-frame">
              <img src="/gatita-portada-cruz.png" alt="Gatita blanca completa junto a una cruz y una biblia" />
            </span>

            <span className="cover-title-panel">
              <small>Una invitación muy especial</small>
              <strong>Mi Bautizo</strong>
              <em>Valentina</em>
              <span className="tap-to-open">
                <i aria-hidden="true">♡</i>
                Toca para abrir
              </span>
            </span>
          </button>
          <p className="cover-instruction">Toca la tarjeta para descubrir la invitación</p>
        </div>
      )}

      {coverStage === 'open' && <article className="invitation-scroll">
        <section className="hero-section" aria-labelledby="invitation-title">
          <div className="cat-walkway">
            <div className="footsteps" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => <i key={index} />)}
            </div>
            <div className="cat-arrival">
              <img
                className="walking-kitty"
                src="/gatita-portada-cruz.png"
                alt="Gatita blanca con moño rosa, cruz y Biblia"
              />
            </div>
          </div>

          {showOpeningCat && (
            <div
              className="opening-cat-overlay"
              aria-hidden="true"
              onAnimationEnd={() => setShowOpeningCat(false)}
            >
              <span className="opening-cat-runner">
                <video
                  src="/gatita-picsart.webm"
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={() => setShowOpeningCat(false)}
                />
              </span>
            </div>
          )}

          <div className="hero-copy">
            <span className="eyebrow">Con mucha alegría</span>
            <div className="gold-divider" aria-hidden="true"><span />✝<span /></div>
            <p>Acompáñanos a celebrar mi</p>
            <h1 id="invitation-title">Bautizo</h1>
            <h2>Valentina</h2>
            <p className="hero-message">
              Un día bendecido, rodeada del amor de mi familia y de las personas que más quiero.
            </p>
            <button className="primary-button shine" onClick={() => detailsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Ver invitación <span aria-hidden="true">↓</span>
            </button>
            <small>La gatita llega dando pasitos; después solo desliza hacia abajo</small>
          </div>
        </section>

        <section ref={detailsRef} className="event-section reveal-section" id="celebracion">
          <span className="eyebrow">Guarda la fecha</span>
          <h2>La celebración</h2>
          <p className="section-intro">Con la bendición de Dios y de nuestros padres</p>

          <div className="date-row">
            <div className="date-circle">
              <span>NOV</span>
              <strong>14</strong>
            </div>
            <div className="date-text">
              <strong>Sábado</strong>
              <span>2026 · 11:00 a. m.</span>
            </div>
          </div>

          <div className="countdown" aria-label="Cuenta regresiva">
            <div><strong>{countdown.days}</strong><span>Días</span></div>
            <div><strong>{countdown.hours}</strong><span>Horas</span></div>
            <div><strong>{countdown.minutes}</strong><span>Minutos</span></div>
          </div>
        </section>

        <section className="places-section reveal-section" aria-labelledby="places-title">
          <span className="eyebrow">Te esperamos</span>
          <h2 id="places-title">Los lugares</h2>

          <div className="place-list">
            {places.map((place, index) => (
              <article className="place-card" key={place.name} style={{ '--delay': `${index * 120}ms` } as CSSProperties}>
                <span className="place-icon" aria-hidden="true">{place.icon}</span>
                <div>
                  <small>{place.label}</small>
                  <h3>{place.name}</h3>
                  <p>{place.address}</p>
                  <a href={place.map} target="_blank" rel="noreferrer">Abrir mapa <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Sección de padrinos */}

       <section className="places-section reveal-section" aria-labelledby="godparents-title">
  <span className="eyebrow">Personas especiales</span>


<h2 id="godparents-title">Mis padres</h2>

<div className="place-list">
    {myParents.map((myParents, index) => (
      <article
        className="place-card"
        key={myParents.name}
        style={{ '--delay': `${index * 120}ms` } as CSSProperties}
      >
        <span className="place-icon" aria-hidden="true">
          {myParents.icon}
        </span>

        <div>
          <small>{myParents.role}</small>

          <h3>{myParents.name}</h3>

         
        </div>
      </article>
    ))}
  </div>
  
  <h2 id="godparents-title">Mis padrinos</h2>

  <div className="place-list">
    {godparents.map((godparent, index) => (
      <article
        className="place-card"
        key={godparent.name}
        style={{ '--delay': `${index * 120}ms` } as CSSProperties}
      >
        <span className="place-icon" aria-hidden="true">
          {godparent.icon}
        </span>

        <div>
          <small>{godparent.role}</small>

          <h3>{godparent.name}</h3>

         
        </div>
      </article>
    ))}
  </div>
</section>

        <section className="blessing-section reveal-section">
          <span className="cross-mark" aria-hidden="true">✝</span>
          <blockquote>
            “Dejen que los niños vengan a mí, porque de ellos es el reino de los cielos.”
            <cite>Mateo 19:14</cite>
          </blockquote>
        </section>

        <section className="wish-section reveal-section" aria-labelledby="wish-title">
          <span className="eyebrow">Un detalle especial</span>
          <h2 id="wish-title">Deja un deseo para Valentina</h2>
          <p>Escribe unas palabras bonitas y las prepararemos para enviarlas por WhatsApp.</p>

          <form onSubmit={sendWish}>
            <label>
              Tu nombre
              <input value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Escribe tu nombre" />
            </label>
            <label>
              Tu mensaje
              <textarea value={wishMessage} onChange={(event) => setWishMessage(event.target.value)} placeholder="Que Dios te bendiga siempre…" rows={3} />
            </label>
            <button className="primary-button whatsapp-button" type="submit">Enviar por WhatsApp</button>
          </form>

          <button className="share-link" onClick={shareInvitation}>Compartir la invitación completa</button>
          {notice && <p className="notice" role="status">{notice}</p>}
        </section>

        <footer>
          <span aria-hidden="true">♡</span>
          <p>Gracias por acompañarnos en este día tan especial</p>
        </footer>
      </article>}
    </main>
  );
}
