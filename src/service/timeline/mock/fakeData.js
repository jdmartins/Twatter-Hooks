import { internet, lorem, random } from 'faker';
const randomInt = () => Math.floor(Math.random() * (10 - 1 + 1) + 10);

export const twat = () => ({
  id: random.uuid(),
  avatar: internet.avatar(),
  ip: internet.ip(),
  date: Date.now(),
  content: lorem.paragraph(1),
  liked: false,
  retweets: randomInt()
});
