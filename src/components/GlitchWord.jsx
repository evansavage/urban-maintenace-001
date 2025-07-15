import { forwardRef, useEffect, useState } from 'react';
import { glitchProfiles } from '../ArtistProfiles';

const randomChar = () => {
  const chars = '█▓▒░#@!?%#';
  return chars[Math.floor(Math.random() * chars.length)];
};

function getRandomInt(min, max) {
  min = Math.ceil(min); // Round up the min
  max = Math.floor(max); // Round down the max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
      interval: getRandomInt(100, 350),
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
          //   transform: profile.jitter
          //     ? `translate(${Math.random() * 2}px, ${Math.random() * 2}px)`
          //     : 'none',
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

export default GlitchWord;
