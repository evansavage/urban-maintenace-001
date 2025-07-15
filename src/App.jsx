import { forwardRef, useEffect, useRef, useState, useLayoutEffect } from 'react';
import ButterchurnVisualizer from './components/ButterchurnVisualizer';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import { BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import { SmartTicker } from 'react-smart-ticker';
import EmailButton from './components/EmailButton';
import GlitchWord from './components/GlitchWord';
import GlitchOverlay from './components/GlitchOverlay';

function shuffleArray(array) {
  const arr = [...array]; // make a copy to avoid mutating the original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let audioPlaylist = [
  '/tracks/Dark Just - Sunun.mp3',
  '/tracks/Ozone Riddim - Ultrakey.mp3',
  '/tracks/Alles Klar - The Sentinel.mp3',
  '/tracks/Midnight 20_Edit - Eduardo de la Calle.mp3',
  '/tracks/Vaporware 07 - Donato Dozzy.mp3',
  '/tracks/Portal - Markus Suckut.mp3',
  "/tracks/And - Stomu Yamash'ta.mp3",
  '/tracks/Let It Rip - Digitalis.mp3',
  '/tracks/Crystal - Koxbox.mp3',
  '/tracks/Everything but You - Seul Ensemble.mp3',
  '/tracks/On The Beach (Timefall Mix) - Caroline Polachek.mp3',
  '/tracks/Paradise Engineering - Barker.mp3',
  '/tracks/planar - egavas.mp3',
  '/tracks/The Beach - Dan Meyer.mp3',
];

audioPlaylist = shuffleArray(audioPlaylist);

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
      currentTrackIndex !== null ? audioPlaylist[currentTrackIndex].split('/')[2] : ''
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
            <GlitchWord text="2 AM - 10 AM" />
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
