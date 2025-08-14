export const getRandomInt = (min = 80, max = 400) => {
  min = Math.ceil(min); // Round up the min
  max = Math.floor(max); // Round down the max
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const glitchProfiles = [
  {
    name: 'Zara Dekho',
    interval: getRandomInt(),
    jitter: true,
    swapRate: 0.1,
    url: 'https://www.instagram.com/zaradekh0/',
    time: '4-6',
  },
  {
    name: 'Marios',
    interval: getRandomInt(),
    jitter: false,
    swapRate: 0.4,
    url: 'https://www.instagram.com/marioszervos/',
    time: '6-8',
  },
  {
    name: 'Buzi',
    interval: getRandomInt(),
    jitter: false,
    swapRate: 0.3,
    url: 'https://www.instagram.com/buzibuzibuzibuzibuzibuzi/',
    time: '2-4',
  },
  {
    name: 'Roni',
    interval: getRandomInt(),
    jitter: true,
    swapRate: 0.3,
    url: 'https://www.instagram.com/roni_pit/',
    time: '8-10',
  },
];
