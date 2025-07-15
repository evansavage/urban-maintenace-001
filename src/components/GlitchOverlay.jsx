import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchWord from './GlitchWord';
import { glitchProfiles } from '../ArtistProfiles';

const GlitchOverlay = ({ timeTable, onTimeTableClick }) => {
  const timeTableOrder = [2, 0, 1, 3];
  const [artistList, setArtistList] = useState(glitchProfiles);

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
        style={{ marginBottom: '30px', marginTop: '11px' }}
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
      {/* {!!useTimetable && (
        <button
          style={{ pointerEvents: 'auto', fontFamily: 'monospace' }}
          onClick={onTimeTableClick}
        >
          {timeTable ? 'Off' : 'Timetable'}
        </button>
      )} */}
    </div>
  );
};

export default GlitchOverlay;
