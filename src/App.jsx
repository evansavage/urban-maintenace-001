import { forwardRef, useEffect, useRef, useState, useLayoutEffect } from 'react';
import ButterchurnVisualizer from './ButterchurnVisualizer';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import { BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import { SmartTicker } from 'react-smart-ticker';
import { motion, AnimatePresence } from 'framer-motion';

const useTimetable = import.meta.env.VITE_USE_TIMETABLE === 'true';

const audioPlaylist = [
  '/tracks/Dark Just - Sunun.mp3',
  '/tracks/Ozone Riddim - Ultrakey.mp3',
  '/tracks/Midnight 20_Edit - Eduardo de la Calle.mp3',
  '/tracks/Vaporware 07 - Donato Dozzy.mp3',
  '/tracks/Portal - Markus Suckut.mp3',
  '/tracks/ipsome - egavas.mp3',
  "/tracks/And - Stomu Yamash'ta.mp3",
  '/tracks/Crystal - Koxbox.mp3',
  '/tracks/Everything but You - Seul Ensemble.mp3',
  '/tracks/On The Beach (Timefall Mix) - Caroline Polachek.mp3',
  '/tracks/Paradise Engineering - Barker.mp3',
  '/tracks/planar - egavas.mp3',
];

const glitchProfiles = [
  {
    name: '98dots',
    interval: 500,
    jitter: true,
    swapRate: 0.3,
    url: 'https://www.instagram.com/98dots/',
    time: '4-6',
  },
  {
    name: 'fabiola',
    interval: 800,
    jitter: false,
    swapRate: 0.4,
    url: 'https://www.instagram.com/fabi0la/',
    time: '6-8',
  },
  {
    name: 'egavas',
    interval: 350,
    jitter: true,
    swapRate: 0.1,
    url: 'https://www.instagram.com/___egavas___/',
    time: '2-4',
  },
  {
    name: 'roni',
    interval: 1200,
    jitter: false,
    swapRate: 0.3,
    url: 'https://www.instagram.com/roni_pit/',
    time: '8-10',
  },
];

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

const GlitchWord = forwardRef(
  ({ text, style = {}, className = '', time = '', timeTable = false }, ref) => {
    const [glitchedText, setGlitchedText] = useState(text);
    const profile = glitchProfiles.find((artist) => artist.name === text) || {
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

    return profile?.url ? (
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
          className={'glitch-text ' + className}
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
          {glitchedText} {!!timeTable && time}
        </div>
      </a>
    ) : (
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
    );
  }
);

const GlitchOverlay = () => {
  const timeTableOrder = [2, 0, 1, 3];
  const [artistList, setArtistList] = useState(glitchProfiles);
  const [timeTable, setTimeTable] = useState(false);

  const onTimeTableClick = () => {
    setTimeTable((timeTable) => !timeTable);
  };

  useEffect(() => {
    if (timeTable) {
      setArtistList(timeTableOrder.map((order) => glitchProfiles[order]));
    } else {
      setArtistList(glitchProfiles);
    }
  }, [timeTable]);

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
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <AnimatePresence>
            {artistList.map((artist) => (
              <motion.li
                key={artist.name}
                layout // 🔥 This handles smooth position transitions
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '300px',
                    flexDirection: 'row',
                    maxWidth: '280px',
                  }}
                >
                  <GlitchWord
                    text={`${artist.name}`}
                    className="artist-name"
                    timeTable={timeTable}
                    style={{ textAlign: 'left' }}
                  />
                  {!!timeTable && (
                    <GlitchWord
                      text={artist.time}
                      className="artist-name"
                      timeTable={timeTable}
                      style={{ textAlign: 'right' }}
                    />
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      {!!useTimetable && (
        <button
          style={{ pointerEvents: 'auto', fontFamily: 'monospace' }}
          onClick={onTimeTableClick}
        >
          {timeTable ? 'Off' : 'Timetable'}
        </button>
      )}
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
          // border: '1px solid black',
          textDecoration: 'none',
          mixBlendMode: 'normal',
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

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState('');

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

  useEffect(() => {
    setCurrentTrackName(
      currentTrackIndex !== null ? audioPlaylist[currentTrackIndex].split('/')[2].split('.')[0] : ''
    );
  }, [currentTrackIndex, shouldScroll]);

  useLayoutEffect(() => {
    const checkOverflow = () => {
      const content = contentRef.current;
      const container = containerRef.current;

      if (content && container) {
        const contentWidth = content.scrollWidth;
        const containerWidth = container.clientWidth;

        setShouldScroll(contentWidth > containerWidth);
      }
    };

    // Observe changes to the contentRef node
    const observer = new MutationObserver(() => {
      checkOverflow();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }

    // Run once on mount or when track name changes
    const raf = requestAnimationFrame(() => checkOverflow());

    // Also check on window resize
    window.addEventListener('resize', checkOverflow);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkOverflow);
      cancelAnimationFrame(raf);
    };
  }, [currentTrackName]);

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
    const next = (currentTrackIndex + 1) % audioPlaylist.length;
    setCurrentTrackIndex(next);
  };

  const handlePrevious = () => {
    const prev = (currentTrackIndex - 1 + audioPlaylist.length) % audioPlaylist.length;
    setCurrentTrackIndex(prev);
  };
  return (
    <div>
      {!visualizerEnabled && (
        <div className={`enter-button-container ${enterClicked ? 'fade-out' : ''}`}>
          <GlitchWord
            text="UM001"
            style={{ position: 'absolute', top: '-120px', left: '-20px', width: '200px' }}
          />
          <button
            className="enter-button"
            onClick={handleEnter}
            disabled={enterClicked}
            style={{ backgroundColor: 'blue' }}
          >
            <GlitchWord text="enter" style={{ fontSize: '40px' }} />
          </button>
          <div
            style={{
              fontFamily: 'monospace',
              position: 'absolute',
              left: '-54px',
              bottom: '-90px',
              fontSize: '20px',
              width: '280px',
            }}
          >
            ⚠️ flashing lights! ⚠️
          </div>
        </div>
      )}

      {visualizerEnabled && audioContext && currentTrackName && (
        <>
          <ButterchurnVisualizer audioContext={audioContext} audioElement={htmlAudioElement} />
          <EmailButton
            to="track.maintenance.nyc@gmail.com"
            subject="URBAN MAINTENANCE 001"
            body="<Hey! Remove this and write to us about the party! We're excited to have ya :)>"
          >
            <GlitchWord text="RSVP - UM001" style={{ fontSize: '20px', mixBlendMode: 'normal' }} />
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
                width: '100%',
              }}
            >
              {shouldScroll ? (
                <SmartTicker recalcDeps={[currentTrackName]} style={{ marginRight: '40px' }}>
                  <div
                    ref={contentRef}
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <GlitchWord text={currentTrackName} style={{ fontSize: '15px' }} />
                  </div>
                </SmartTicker>
              ) : (
                <div
                  ref={contentRef}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <GlitchWord text={currentTrackName} style={{ fontSize: '15px' }} />
                </div>
              )}
            </div>
            <AudioPlayer
              key={currentTrackName + currentTrackIndex}
              ref={audioRef}
              src={audioPlaylist[currentTrackIndex]}
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
