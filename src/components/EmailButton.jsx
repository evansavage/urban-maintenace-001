import { useEffect, useRef, useState } from 'react';
import { GiAlienBug } from 'react-icons/gi';
import { FaInstagram, FaGithub } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const instagramLink = 'https://www.instagram.com/___egavas___/';
const gitHubLink = 'https://github.com/evansavage';

const desktopToastOffset = { top: 100, right: 65 };
const mobileToastOffset = { bottom: 240, left: 10 };

const EmailButton = ({ to, subject, body, children }) => {
  const eSub = encodeURIComponent(subject);
  const eBody = encodeURIComponent(body);
  const href = `mailto:${to}?subject=${eSub}&body=${eBody}`;
  const gmailLink = `https://mail.google.com/mail/?view=cm&to=${to}&su=${eSub}&body=${eBody}`;
  const [isOpen, setIsOpen] = useState(false); // Mounted
  const [isVisible, setIsVisible] = useState(false); // Fade in/out
  const modalRef = useRef(null);
  const [toastPosition, setToastPosition] = useState('top-right');
  const [toastOffset, setToastOffset] = useState(desktopToastOffset);

  // Open modal handler
  const toggleModal = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => setIsVisible(true), 10); // fade in
    } else {
      setIsVisible(false); // trigger fade out
      setTimeout(() => setIsOpen(false), 200); // unmount after fade
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(to);
      toast.success('Email copied ✅ Get in Touch 🤗', { id: new Date().toLocaleTimeString() });
    } catch (err) {
      toast.error('Failed to copy email.');
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 200);
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

  const handleClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 920) {
        setToastPosition('bottom-left');
        setToastOffset(mobileToastOffset);
      } else {
        setToastPosition('top-right');
        setToastOffset(desktopToastOffset);
      }
    };

    // Set on load
    handleResize();

    // Listen to resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="email-button-wrapper">
      <Toaster
        containerStyle={{
          fontFamily: 'monospace',
          borderRadius: '2px',
          zIndex: 1000,
          ...toastOffset,
        }}
        position={toastPosition}
        reverseOrder={toastPosition !== 'top-right'}
        toastOptions={{
          style: {
            // mixBlendMode: 'difference',
            backgroundColor: '#fff',
            backdropFilter: 'blur(8px)',
            color: 'black',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          },
        }}
      />
      <a
        onClick={handleCopy}
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
          cursor: 'pointer',
        }}
      >
        {children}
      </a>

      <div
        onClick={toggleModal}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff0',
          mixBlendMode: 'difference',
          borderRadius: '50%', // optional
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out, color 0.2s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <GiAlienBug size={28} color={isOpen ? 'limegreen' : 'red'} />
      </div>
      {isOpen && (
        <div
          ref={modalRef}
          style={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
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
            width: '400px', // ✅ Make it flexible
            maxWidth: 'calc(100vw - 68px)', // ✅ Cap at 400px
            height: '150px',
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          <p style={{ color: 'black', fontSize: '15px' }}>
            This website was created by{' '}
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'blue' }}
            >
              egavas
            </a>
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '60px',
              justifyContent: 'space-between',
            }}
          >
            <FaInstagram color="blue" size={20} onClick={() => handleClick(instagramLink)} />
            <FaGithub color="blue" size={20} onClick={() => handleClick(gitHubLink)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailButton;
