'use client';

import { useEffect, useRef, useState } from 'react';

const screens = [
  { label: 'Bienvenida' },
  { label: 'La celebración' },
  { label: 'Los detalles' },
];

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [direction, setDirection] = useState<'next' | 'back'>('next');
  const [notice, setNotice] = useState('');
  const touchStart = useRef<number | null>(null);

  const goTo = (next: number) => {
    if (next < 0 || next >= screens.length) return;
    setDirection(next > screen ? 'next' : 'back');
    setScreen(next);
    setNotice('');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter') goTo(screen + 1);
      if (event.key === 'ArrowLeft') goTo(screen - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [screen]);

  const shareInvitation = async () => {
    const shareData = {
      title: 'Bautizo de Valentina',
      text: 'Acompáñanos a celebrar el bautizo de Valentina.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setNotice('Enlace copiado para compartir');
    } catch {
      setNotice('Puedes copiar el enlace desde tu navegador');
    }
  };

  return (
    <main className="invitation-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <section
        className="invitation"
        aria-label="Invitación al bautizo de Valentina"
        onTouchStart={(event) => {
          touchStart.current = event.changedTouches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStart.current;
          if (distance < -55) goTo(screen + 1);
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
          <article
            key={screen}
            className={`screen screen-${screen + 1} enter-${direction}`}
          >
            {screen === 0 && (
              <>
                <img
                  className="watercolor watercolor-cover"
                  src="/bautizo-watercolor.png"
                  alt="Gatita blanca, flores rosas, pila bautismal y rosario en acuarela"
                />
                <div className="cover-copy">
                  <span className="eyebrow">Con mucha alegría</span>
                  <span className="tiny-cross" aria-hidden="true">✝</span>
                  <p className="join-us">Acompáñanos a celebrar mi</p>
                  <h1>Bautizo</h1>
                  <p className="name">Valentina</p>
                  <p className="intro">
                    Un día bendecido, rodeada del amor de mi familia.
                  </p>
                  <button className="primary-button open-button" onClick={() => goTo(1)}>
                    <span>Abrir invitación</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <small>Desliza o toca para descubrir</small>
                </div>
              </>
            )}

            {screen === 1 && (
              <>
                <img
                  className="watercolor watercolor-soft"
                  src="/bautizo-watercolor.png"
                  alt=""
                  aria-hidden="true"
                />
                <div className="details-copy">
                  <span className="eyebrow">Guarda la fecha</span>
                  <span className="tiny-cross" aria-hidden="true">✝</span>
                  <p className="join-us">Con la bendición de Dios y de mis padres</p>
                  <h2>Valentina</h2>
                  <div className="ornament" aria-hidden="true">
                    <span />
                    <b>♡</b>
                    <span />
                  </div>
                  <div className="date-lockup">
                    <div>
                      <span>NOV</span>
                      <strong>14</strong>
                    </div>
                    <p>
                      <b>Sábado</b>
                      <span>2026</span>
                    </p>
                  </div>
                  <p className="time">A las 11:00 de la mañana</p>
                  <blockquote>
                    “Dejen que los niños vengan a mí, porque de ellos es el reino de los cielos.”
                    <cite>Mateo 19:14</cite>
                  </blockquote>
                </div>
              </>
            )}

            {screen === 2 && (
              <>
                <img
                  className="watercolor watercolor-corner"
                  src="/bautizo-watercolor.png"
                  alt=""
                  aria-hidden="true"
                />
                <div className="locations-copy">
                  <span className="eyebrow">Te esperamos</span>
                  <h2>Detalles del día</h2>

                  <div className="place-card">
                    <div className="place-icon" aria-hidden="true">✝</div>
                    <div>
                      <span>Ceremonia · 11:00 a. m.</span>
                      <h3>Parroquia Nuestra Señora de la Paz</h3>
                      <p>Av. Principal 123, Col. Centro</p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Parroquia+Nuestra+Señora+de+la+Paz"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Cómo llegar <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>

                  <div className="place-card">
                    <div className="place-icon" aria-hidden="true">♕</div>
                    <div>
                      <span>Recepción · 1:00 p. m.</span>
                      <h3>Jardín Las Rosas</h3>
                      <p>Calle del Lago 45, Col. Jardines</p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Jardin+Las+Rosas"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Cómo llegar <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>

                  <div className="rsvp-card">
                    <span>Tu presencia es nuestro mejor regalo</span>
                    <button className="primary-button" onClick={shareInvitation}>
                      Compartir invitación
                    </button>
                    {notice && <p role="status">{notice}</p>}
                  </div>
                </div>
              </>
            )}
          </article>
        </div>

        <footer className="navigation">
          <button
            className="nav-button"
            onClick={() => goTo(screen - 1)}
            disabled={screen === 0}
            aria-label="Pantalla anterior"
          >
            ←
          </button>
          <p>{screen === 2 ? 'Gracias por acompañarnos' : 'Continúa descubriendo'}</p>
          <button
            className="nav-button nav-button-next"
            onClick={() => screen === 2 ? goTo(0) : goTo(screen + 1)}
            aria-label={screen === 2 ? 'Volver al inicio' : 'Pantalla siguiente'}
          >
            {screen === 2 ? '↻' : '→'}
          </button>
        </footer>
      </section>
    </main>
  );
}
