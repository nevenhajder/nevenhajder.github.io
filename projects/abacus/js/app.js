import { Abacus } from './abacus.js';

window.addEventListener('load', () => {
  const abacus = new Abacus('#abacus-wrap');
  abacus.init();
});
