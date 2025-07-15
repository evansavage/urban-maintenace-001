import { forwardRef, useEffect, useRef, useState } from 'react';
import ButterchurnVisualizer from './ButterchurnVisualizer';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import { BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import butterchurnPresets from 'butterchurn-presets';
import { SmartTicker } from 'react-smart-ticker';

// Setup presets once
const allPresets = butterchurnPresets.getPresets();
const presetNames = Object.keys(allPresets);

const audioPlaylist = [
  '/tracks/Dark Just - Sunun.mp3',
  '/tracks/オゾンリズム Ozone Riddim - Ultrakey.mp3',
  '/tracks/Midnight 20_Edit - Eduardo de la Calle.mp3',
  '/tracks/Vaporware 07 - Donato Dozzy.mp3',
  '/tracks/Portal - Markus Suckut.mp3',
  '/tracks/ipsome - egavas.mp3',
  "/tracks/And - Stomu Yamash'ta.mp3",
  '/tracks/Crystal - Koxbox.mp3',
  '/tracks/Everything but You - Seul Ensemble.mp3',
  '/tracks/On The Beach - Timefall Mix.mp3',
  '/tracks/Paradise Engineering - Barker.mp3',
  '/tracks/planar - egavas.mp3',
];

const glitchProfiles = {
  '98dots': {
    interval: 500,
    jitter: true,
    swapRate: 0.2,
    url: 'https://www.instagram.com/98dots/',
  },
  fabiola: {
    interval: 800,
    jitter: false,
    swapRate: 0.4,
    url: 'https://www.instagram.com/fabi0la/',
  },
  egavas: {
    interval: 350,
    jitter: true,
    swapRate: 0.1,
    url: 'https://www.instagram.com/___egavas___/',
  },
  roni: {
    interval: 1200,
    jitter: false,
    swapRate: 0.3,
    url: 'https://www.instagram.com/roni_pit/',
  },
};

const randomChar = () => {
  const chars = '█▓▒░#@!?%#';
  return chars[Math.floor(Math.random() * chars.length)];
};

const scramble = (text, rate) => {
  return text
    .split('')
    .map((char) => (Math.random() < rate ? randomChar() : char))
    .join('');
};

const ScrollTitle = ({ children }) => (
  <SmartTicker speed={80}>
    <div>{children}</div>
  </SmartTicker>
);

const GlitchWord = forwardRef(({ text, style = {}, className = '' }, ref) => {
  const [glitchedText, setGlitchedText] = useState(text);
  const profile = glitchProfiles[text.toLowerCase()] || {
    interval: 350,
    jitter: true,
    swapRate: 0.1,
  };

  useEffect(() => {
    let original = text;
    let timeout;

    const glitch = () => {
      const scrambled = scramble(original, profile.swapRate);
      setGlitchedText(scrambled);

      // Restore original after short delay
      timeout = setTimeout(() => {
        setGlitchedText(original);
      }, 100);
    };

    const interval = setInterval(() => {
      glitch();
    }, profile.interval);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text, profile]);

  return (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: 'none',
        pointerEvents: 'auto', // override inner pointerEvents: none
        mixBlendMode: 'difference',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        ref={ref}
        className={className}
        style={{
          fontSize: '3.5rem',
          fontFamily: 'monospace',
          color: 'white',
          mixBlendMode: 'difference',
          textShadow: '0 0 2px red, 0 0 4px cyan',
          transform: profile.jitter
            ? `translate(${Math.random() * 2}px, ${Math.random() * 2}px)`
            : 'none',
          transition: 'transform 0.1s',
          pointerEvents: 'none',
          ...style,
        }}
      >
        {glitchedText}
      </div>
    </a>
  );
});

const GlitchOverlay = ({ activePreset }) => {
  return (
    <div
      className="names-container"
      style={{
        position: 'absolute',
        top: 0,
        left: '20px',
        height: '80%',
        zIndex: 10,
        display: 'flex',
        marginTop: 'auto',
        flexDirection: 'column',
        alignItems: 'start',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
      }}
    >
      <GlitchWord
        text="URBAN MAINTENANCE"
        className="poster-title"
        style={{ marginBottom: '30px', marginTop: '20px' }}
      />
      <div className="artist-wrapper">
        {Object.keys(glitchProfiles).map((name) => (
          <GlitchWord key={name} text={name} className="artist-name" />
        ))}
      </div>
    </div>
  );
};

const EmailButton = ({ to, subject, body, children }) => {
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

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
          border: '1px solid black',
          textDecoration: 'none',
          mixBlendMode: 'difference',
        }}
      >
        {children}
      </a>
    </div>
  );
};

const App = () => {
  const [htmlAudioElement, setHtmlAudioElement] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [visualizerEnabled, setVisualizerEnabled] = useState(false);
  const [enterClicked, setEnterClicked] = useState(false);
  const [activePreset, setActivePreset] = useState(() => {
    const random = allPresets[presetNames[Math.floor(Math.random() * presetNames.length)]];
    return random;
  });

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const audioRef = useRef(null);

  const getRandomTrackIndex = (excludeIndex = null) => {
    const indices = audioPlaylist.map((_, i) => i).filter((i) => i !== excludeIndex);
    const rand = Math.floor(Math.random() * indices.length);
    return indices[rand];
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Cycle presets every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const nextPreset = allPresets[presetNames[Math.floor(Math.random() * presetNames.length)]];
      setActivePreset(nextPreset);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (
        contentRef.current &&
        containerRef.current &&
        contentRef.current.scrollWidth > containerRef.current.clientWidth
      ) {
        setShouldScroll(true);
      } else {
        setShouldScroll(false);
      }
    };

    const observer = new MutationObserver(() => {
      checkOverflow();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        characterData: true,
        subtree: true,
        childList: true,
      });
    }

    window.addEventListener('resize', checkOverflow);
    checkOverflow(); // Run immediately once as well

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [currentTrackIndex]);

  const handleEnter = async () => {
    setEnterClicked(true);
    const ctx = new AudioContext();
    setAudioContext(ctx);

    const index = getRandomTrackIndex();
    setCurrentTrackIndex(index);
    setVisualizerEnabled(true);
  };

  const handlePlay = () => {
    const htmlAudio = audioRef.current?.audio?.current;
    if (!htmlAudio || !audioContext) return;

    setHtmlAudioElement(htmlAudio); // ⚠️ Only pass the audio element

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  const handleNext = () => {
    const next = (currentTrackIndex + 1) % (audioPlaylist.length - 1);
    setCurrentTrackIndex(next);
  };

  const handlePrevious = () => {
    const prev = (currentTrackIndex - 1) % (audioPlaylist.length - 1);
    setCurrentTrackIndex(prev);
  };

  const currentTrack = currentTrackIndex !== null ? audioPlaylist[currentTrackIndex] : null;

  const getTrackName = (url) =>
    url
      ?.split('/')
      .pop()
      ?.replace(/\.[^/.]+$/, '') || '';

  return (
    <div>
      {!visualizerEnabled && (
        <div className={`enter-button-container ${enterClicked ? 'fade-out' : ''}`}>
          <button className="enter-button" onClick={handleEnter} disabled={enterClicked}>
            <GlitchWord text="enter" />
          </button>
        </div>
      )}

      {visualizerEnabled && audioContext && currentTrack && (
        <>
          <ButterchurnVisualizer
            audioContext={audioContext}
            audioElement={htmlAudioElement}
            activePreset={activePreset}
          />
          <EmailButton
            to="track.maintenance.nyc@gmail.com"
            subject="URBAN MAINTENANCE 001"
            body="<Hey! Remove this and write to us about the party! We're excited to have ya :)>"
          >
            <GlitchWord text="RSVP - UM001" style={{ fontSize: '20px' }} />
          </EmailButton>

          <GlitchOverlay />
          <div className="details-wrapper">
            <GlitchWord text="July 27th" />
            <GlitchWord text="2-10 AM" />
            <GlitchWord text="Beach Location TBA" />
          </div>
          <div className="audio-player-wrapper">
            <div
              ref={containerRef}
              className="track-title"
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                color: 'black',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              {shouldScroll ? (
                <SmartTicker>
                  <GlitchWord
                    ref={contentRef}
                    text={getTrackName(currentTrack) + '        '}
                    style={{
                      fontSize: '15px',
                    }}
                  />
                </SmartTicker>
              ) : (
                <GlitchWord
                  ref={contentRef}
                  text={getTrackName(currentTrack)}
                  style={{
                    fontSize: '15px',
                  }}
                />
              )}
            </div>
            <AudioPlayer
              key={currentTrack + currentTrackIndex}
              ref={audioRef}
              src={currentTrack}
              autoPlay
              showSkipControls={true}
              showJumpControls={false} // These are 15s by default, we override with our own
              onPlay={handlePlay}
              onEnded={handleNext}
              onClickNext={handleNext}
              layout="horizontal"
              onClickPrevious={handlePrevious}
              showDownloadProgress={false}
              customIcons={{
                previous: <BsSkipStartFill size={36} color="white" />,
                next: <BsSkipEndFill size={36} color="white" />,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
