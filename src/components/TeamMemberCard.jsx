'use client';

import { useState, useRef } from 'react';

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export default function FlipCard({ name, role, photo, linkedin = '', github = '', quote = '' }) {
  const [flipped, setFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const cardRef = useRef(null);
  const hasLinks = linkedin || github;
  const showPhoto = photo && !imgFailed;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotX = (mouseY - centerY) / 25;
    const rotY = (centerX - mouseX) / 25;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      className="flip-card"
      onClick={() => setFlipped((f) => !f)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className={`flip-card-inner${flipped ? ' is-flipped' : ''}`}>
        <div className="flip-card-front member-card">
          <div className="card-photo">
            {showPhoto ? (
              <img src={photo} alt={name} onError={() => setImgFailed(true)} />
            ) : (
              <div className="card-photo-placeholder">👤</div>
            )}
            <div className="card-photo-scrim" />
          </div>
          <div className="card-info">
            <div className="card-name">{name}</div>
            <div className="card-accent-line" />

            {linkedin && github ? (
              <>
                <div className="card-role">{role}</div>
                <div className="card-links">
                  <a
                    href={linkedin}
                    className="card-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="LinkedIn"
                  >
                    <LinkedInIcon />
                  </a>
                  <a
                    href={github}
                    className="card-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="GitHub"
                  >
                    <GitHubIcon />
                  </a>
                </div>
              </>
            ) : hasLinks ? (
              <div className="card-role-row">
                <div className="card-role">{role}</div>
                <a
                  href={linkedin || github}
                  className="card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={linkedin ? 'LinkedIn' : 'GitHub'}
                >
                  {linkedin ? <LinkedInIcon /> : <GitHubIcon />}
                </a>
              </div>
            ) : (
              <div className="card-role">{role}</div>
            )}
          </div>
        </div>

        <div className="flip-card-back member-card">
          <div className="card-back-inner">
            <p className="card-back-quote" style={{ opacity: quote ? 1 : 0.2 }}>
              {quote || '✦'}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flip-card {
          width: 100%;
          height: 100%;
          cursor: pointer;
          position: relative;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-style: preserve-3d;
        }

        .flip-card-inner.is-flipped {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .flip-card-front {
          transform: rotateY(0deg);
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }

        .member-card {
          display: block;
          padding: 0;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(10, 10, 20, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
          height: 280px;
          width: 220px;
          overflow: hidden;
        }

        .card-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin-bottom: 0;
          overflow: hidden;
          border: none;
          border-radius: 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .card-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }

        .card-photo-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 45%,
            rgba(0, 15, 25, 0.55) 70%,
            rgba(0, 10, 20, 0.9) 100%
          );
        }

        .card-photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }

        .card-info {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          padding: 14px 16px 16px;
        }

        .card-name {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: 0.01em;
        }

        .card-accent-line {
          width: 24px;
          height: 2px;
          background: linear-gradient(90deg, rgba(125, 211, 252, 0.9), rgba(167, 139, 250, 0.9));
          margin: 2px 0;
          border-radius: 2px;
        }

        .card-role {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .card-role-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          width: 100%;
        }

        .card-role-row .card-role {
          margin-bottom: 0;
        }

        .card-links {
          display: flex;
          gap: 8px;
          margin-top: 2px;
        }

        .card-link {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .card-link:hover {
          background: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .card-back-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 20px;
          width: 100%;
          height: 100%;
        }

        .card-back-quote {
          font-size: 11px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.55);
          text-align: center;
          line-height: 1.7;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}