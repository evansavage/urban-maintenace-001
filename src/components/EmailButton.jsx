import { useEffect, useRef, useState } from 'react';
import { GiAlienBug } from 'react-icons/gi';

const EmailButton = ({ to, subject, body, children }) => {
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const [isOpen, setIsOpen] = useState(false); // Mounted
  const [isVisible, setIsVisible] = useState(false); // Fade in/out
  const modalRef = useRef(null);

  // Open modal handler
  const openModal = () => {
    setIsOpen(true); // Mount modal
    setTimeout(() => setIsVisible(true), 10); // Trigger fade in
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsVisible(false); // Trigger fade out
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Unmount after fade-out
  useEffect(() => {
    if (!isVisible && isOpen) {
      const timeout = setTimeout(() => setIsOpen(false), 300); // Wait for fade-out
      return () => clearTimeout(timeout);
    }
  }, [isVisible, isOpen]);

  return (
    <div className="email-button-wrapper">
      <a
        href={href}
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: '#fff',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textDecoration: 'none',
          mixBlendMode: 'normal',
        }}
      >
        {children}
      </a>

      <GiAlienBug
        size={28}
        color="red"
        onClick={openModal}
        style={{ cursor: 'pointer', marginLeft: '10px' }}
      />

      {isOpen && (
        <div
          ref={modalRef}
          style={{
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: '50%',
            left: '50%',
            transform: isVisible
              ? 'translate(calc(-50% - 25px), -50%) scale(1)'
              : 'translate(calc(-50% - 25px), -50%) scale(0.95)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms ease, transform 500ms ease',
            backgroundColor: 'rgba(255, 255, 255, 0.39)',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            margin: '0 25px',
            width: '80%', // ✅ Make it flexible
            maxWidth: '400px', // ✅ Cap at 400px

            height: '320px',
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          <p style={{ color: 'black', fontSize: '15px' }}>
            This website was created by{' '}
            <a
              href="https://www.instagram.com/___egavas___/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'blue' }}
            >
              egavas
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailButton;
