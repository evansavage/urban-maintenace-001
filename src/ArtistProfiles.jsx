export const getRandomInt = (min = 40, max = 200) => {
  min = Math.ceil(min); // Round up the min
  max = Math.floor(max); // Round down the max
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const glitchProfiles = [
  {
    name: '98dots',
    interval: getRandomInt(),
    jitter: true,
    swapRate: 0.3,
    url: 'https://www.instagram.com/98dots/',
    time: '4-6',
  },
  {
    name: 'fabiola',
    interval: getRandomInt(),
    jitter: false,
    swapRate: 0.4,
    url: 'https://www.instagram.com/fabi0la/',
    time: '6-8',
  },
  {
    name: 'egavas',
    interval: getRandomInt(),
    jitter: true,
    swapRate: 0.1,
    url: 'https://www.instagram.com/___egavas___/',
    time: '2-4',
  },
  {
    name: 'roni',
    interval: getRandomInt(),
    jitter: false,
    swapRate: 0.3,
    url: 'https://www.instagram.com/roni_pit/',
    time: '8-10',
  },
];
