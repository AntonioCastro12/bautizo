'use client';

import type { CSSProperties, FormEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

const screens = [
  { label: 'Bienvenida' },
  { label: 'La celebración' },
  { label: 'Los detalles' },
];

const places = [
  {
    type: 'Ceremonia · 11:00 a. m.',
    icon: '✝',
    name: 'Parroquia Nuestra Señora de la Paz',
    address: 'Av. Principal 123, Col. Centro',
    map: 'https://www.google.com/maps/search/?api=1&query=Parroquia+Nuestra+Señora+de+la+Paz',
  },
  {
    type: 'Recepción · 1:00 p. m.',
    icon: '♕',
    name: 'Jardín Las Rosas',
    address: 'Calle del Lago 45, Col. Jardines',
    map: 'https://www.google.com/maps/search/?api=1&query=Jardin+Las+Rosas',
  },
];

const sparkleSymbols = ['✦', '·', '♡', '✧', '·', '✦', '·', '♡', '✧', '·', '✦', '·'];

function getCountdown() {
  const difference = Math.max(0, new Date('2026-11-14T11:00:00-06:00').getTime() - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
  };
}

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [direction, setDirection] = useState<'next' | 'back'>('next');
  const [opened, setOpened] = useState(false);
  const [blessingOpen, setBlessingOpen] = useState(false);
  const [activePlace, setActivePlace] = useState(0);
  const [wishOpen, setWishOpen] = useState(false);
  const [wishName, setWishName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [burstKey, setBurstKey] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const touchStart = useRef<number | null>(null);

  const celebrate = () => setBurstKey(Date.now());

  const goTo = useCallback((next: number) => {
    if (next < 0 || next >= screens.length) return;
    setDirection(next > screen ? 'next' : 'back');
    setScreen(next);
    setNotice('');
    if (next === 2) window.setTimeout(celebrate, 280);
  }, [screen]);

  const advance = useCallback(() => {
    if (screen === 0 && !opened) {
      setOpened(true);
      celebrate();
      return;
    }
    if (screen === 2) {
      setDirection('back');
      setScreen(0);
      return;
    }
    goTo(screen + 1);
  }, [goTo, opened, screen]);

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdown());
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (wishOpen && event.key === 'Escape') {
        setWishOpen(false);
        return;
      }
      if (event.key === 'ArrowRight' || event.key === 'Enter') advance();
      if (event.key === 'ArrowLeft') goTo(screen - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advance, goTo, screen, wishOpen]);

  const handleParallax = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--tilt-x', `${(-y * 2.3).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(x * 2.3).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--glow-x', `${((x + 0.5) * 100).toFixed(0)}%`);
    event.currentTarget.style.setProperty('--glow-y', `${((y + 0.5) * 100).toFixed(0)}%`);
  };

  const resetParallax = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  const shareInvitation = () => {
    const shareData = {
      title: 'Bautizo de Valentina',
      text: 'Acompáñanos a celebrar el bautizo de Valentina.',
      url: window.location.href,
    };
    const message = `${shareData.text}\n${shareData.url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setNotice('Invitación preparada para enviar por WhatsApp');
  };

  const sendWish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = `${wishName || 'Un invitado'}: ${wishMessage || 'Que Dios bendiga siempre a Valentina.'}`;
    const whatsappMessage = `Un deseo para Valentina ♡\n${message}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener,noreferrer');
    setNotice('Tu deseo está listo en WhatsApp');
    setWishOpen(false);
    celebrate();
  };

  return (
    <main className="invitation-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="sparkle-field" aria-hidden="true">
        {sparkleSymbols.map((symbol, index) => (
          <span key={`${symbol}-${index}`} style={{ '--n': index } as CSSProperties}>{symbol}</span>
        ))}
      </div>

      {burstKey > 0 && (
        <div key={burstKey} className="confetti-burst" aria-hidden="true">
          {Array.from({ length: 22 }).map((_, index) => (
            <i key={index} style={{ '--i': index } as CSSProperties} />
          ))}
        </div>
      )}

      <section
        className="invitation"
        aria-label="Invitación al bautizo de Valentina"
        onPointerMove={handleParallax}
        onPointerLeave={resetParallax}
        onTouchStart={(event) => {
          touchStart.current = event.changedTouches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStart.current;
          if (distance < -55) advance();
          if (distance > 55) goTo(screen - 1);
          touchStart.current = null;
        }}
      >
        <header className="progress-bar">
          <p>{screens[screen].label}</p>
          <div className="dots" aria-label={`Pantalla ${screen + 1} de ${screens.length}`}>
            {screens.map((item, index) => (
              <button
                key={item.label}
                className={index === screen ? 'dot dot-active' : 'dot'}
                onClick={() => goTo(index)}
                aria-label={`Ir a ${item.label}`}
                aria-current={index === screen ? 'step' : undefined}
              />
            ))}
          </div>
          <span>{screen + 1} / {screens.length}</span>
        </header>

        <div className="screen-window">
          <article key={screen} className={`screen screen-${screen + 1} enter-${direction}`}>
            {screen === 0 && (
              <div className={`cover-layout ${opened ? 'cover-opened' : ''}`}>
                <div className="portrait-stage">
                  <div className="portrait-halo" aria-hidden="true" />
                  <img
                    className="kitty-portrait"
                    src="/gatita-lazo.png"
                    alt="Gatita blanca con moño rosa y una biblia"
                  />
                </div>

                <div className="cover-copy">
                  <span className="eyebrow">{opened ? 'Invitación abierta' : 'Una invitación muy especial'}</span>
                  <div className="mini-ornament" aria-hidden="true"><span />✝<span /></div>
                  <p className="join-us">Acompáñanos a celebrar mi</p>
                  <h1>Bautizo</h1>
                  <p className="name">Valentina</p>
                  <p className="intro">
                    {opened
                      ? 'Con el corazón lleno de alegría queremos compartir contigo este día bendecido.'
                      : 'Toca el botón y descubre todos los detalles de este día.'}
                  </p>
                  <button className="primary-button shimmer-button" onClick={advance}>
                    <span>{opened ? 'Ver fecha' : 'Abrir invitación'}</span>
                    <span aria-hidden="true">{opened ? '→' : '♡'}</span>
                  </button>
                  <small>También puedes deslizar hacia la izquierda</small>
                </div>
              </div>
            )}

            {screen === 1 && (
              <div className="details-copy">
                <div className="date-kitty-wrap">
                  <img src="/gatita-lazo.png" alt="" aria-hidden="true" />
                </div>
                <span className="eyebrow">Guarda la fecha</span>
                <span className="tiny-cross" aria-hidden="true">✝</span>
                <p className="join-us">Con la bendición de Dios y de mis padres</p>
                <h2>Valentina</h2>
                <div className="date-lockup">
                  <div><span>NOV</span><strong>14</strong></div>
                  <p><b>Sábado</b><span>2026</span></p>
                </div>
                <p className="time">A las 11:00 de la mañana</p>

                <div className="countdown" aria-label="Cuenta regresiva para el evento">
                  <div><strong>{countdown.days}</strong><span>Días</span></div>
                  <div><strong>{countdown.hours}</strong><span>Horas</span></div>
                  <div><strong>{countdown.minutes}</strong><span>Min.</span></div>
                </div>

                <button
                  className={`blessing ${blessingOpen ? 'blessing-open' : ''}`}
                  onClick={() => setBlessingOpen((value) => !value)}
                  aria-expanded={blessingOpen}
                >
                  <span className="blessing-label">{blessingOpen ? 'Una bendición para ti' : 'Toca para revelar una bendición'}</span>
                  <span className="blessing-verse">
                    “Dejen que los niños vengan a mí, porque de ellos es el reino de los cielos.”
                    <cite>Mateo 19:14</cite>
                  </span>
                </button>
              </div>
            )}

            {screen === 2 && (
              <div className="locations-copy">
                <span className="eyebrow">Te esperamos</span>
                <h2>Detalles del día</h2>
                <p className="tap-hint">Toca cada lugar para ver la información</p>

                <div className="place-list">
                  {places.map((place, index) => (
                    <div key={place.name} className={`place-card ${activePlace === index ? 'place-card-open' : ''}`}>
                      <button onClick={() => setActivePlace(index)} aria-expanded={activePlace === index}>
                        <span className="place-icon" aria-hidden="true">{place.icon}</span>
                        <span className="place-summary">
                          <small>{place.type}</small>
                          <strong>{place.name}</strong>
                        </span>
                        <span className="place-chevron" aria-hidden="true">⌄</span>
                      </button>
                      <div className="place-extra">
                        <p>{place.address}</p>
                        <a href={place.map} target="_blank" rel="noreferrer">
                          Abrir mapa <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rsvp-card">
                  <div className="rsvp-kitty" aria-hidden="true">
                    <img src="/gatita-lazo.png" alt="" />
                  </div>
                  <span>Tu presencia es nuestro mejor regalo</span>
                  <div className="action-row">
                    <button className="primary-button" onClick={() => setWishOpen(true)}>Dejar un deseo</button>
                    <button className="whatsapp-share" onClick={shareInvitation} aria-label="Compartir invitación por WhatsApp">WhatsApp</button>
                  </div>
                  {notice && <p role="status">{notice}</p>}
                </div>
              </div>
            )}
          </article>
        </div>

        <footer className="navigation">
          <button className="nav-button" onClick={() => goTo(screen - 1)} disabled={screen === 0} aria-label="Pantalla anterior">←</button>
          <p>{screen === 2 ? 'Gracias por acompañarnos' : opened ? 'Continúa descubriendo' : 'Toca para comenzar'}</p>
          <button className="nav-button nav-button-next" onClick={advance} aria-label={screen === 2 ? 'Volver al inicio' : 'Continuar'}>
            {screen === 2 ? '↻' : '→'}
          </button>
        </footer>
      </section>

      {wishOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setWishOpen(false)}>
          <div className="wish-modal" role="dialog" aria-modal="true" aria-labelledby="wish-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setWishOpen(false)} aria-label="Cerrar">×</button>
            <span aria-hidden="true" className="modal-heart">♡</span>
            <h2 id="wish-title">Un deseo para Valentina</h2>
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
          </div>
        </div>
      )}
    </main>
  );
}
