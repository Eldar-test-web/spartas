/**
 * SPARTANS Yaddaş oyunu — uyğunlaşdırılmış versiya
 *
 * Əsas (upstream): taniarascia/memory (MIT) — https://github.com/taniarascia/memory
 * Dəyişikliklər:
 *  1. KART QRAFİKASI DƏYİŞDİRİLDİ. Upstream Super Mario kartonlarından (Nintendo
 *     müəllif hüquqlu obrazları: mario, luigi, peach, goomba, bobomb, thwomp...)
 *     istifadə edirdi — bunları klonlayıb yayınlamaq qanunsuzdur. Əvəzində klubun
 *     öz SVG ikonları (Sparta motivləri) data-URI kimi yerləşdirilib.
 *  2. QARİŞDIRMA XƏTASI DÜZƏLDİLDİ. `array.sort(() => 0.5 - Math.random())`
 *     obyektsiz qarışdırma deyil (elementlər öz yerində qalır); Fisher–Yates əvəz olundu.
 *  3. `console.log` zibil təmizləndi.
 *  4. Bitmə vəziyyəti, gediş sayğacı və nəticənin ana səhifəyə göndərilməsi əlavə edildi.
 *  5. Dil: Azərbaycanca; rəng: `adapt.css` (#0D6940 + #6FFFBE).
 */

'use strict';

/* Klubun öz ikonları — 24×24 viewBox, tünd yaşıl fon üstündə mint rəngli cizgi */
const ICONS = [
  ['destek', '<path d="M6 20V9a6 6 0 0 1 12 0v11"/><path d="M12 3v6M8 20h8"/>'],
  ['qalqan', '<path d="M12 3 20 6v6c0 4.5-3.4 7.6-8 9-4.6-1.4-8-4.5-8-9V6z"/>'],
  ['mizrək', '<path d="M4 20 20 4"/><path d="M14 4h6v6"/><path d="M6 18l3-3"/>'],
  ['bayquş', '<circle cx="9" cy="10" r="3"/><circle cx="15" cy="10" r="3"/><path d="M12 13v3M6 6l3 2M18 6l-3 2M7 19h10"/>'],
  ['amfore', '<path d="M9 3h6M10 3c0 4-4 5-4 10a6 6 0 0 0 12 0c0-5-4-6-4-10"/><path d="M8 9h8"/>'],
  ['disk', '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>'],
  ['dəfn', '<path d="M12 21c-4-3-7-6-7-11 0-3 2-5 4-5 2 0 3 1 3 3M12 21c4-3 7-6 7-11 0-3-2-5-4-5-2 0-3 1-3 3"/>'],
  ['üçdişli', '<path d="M5 21V9M12 21V5M19 21V9"/><path d="M3 9h4M10 5h4M17 9h4"/>'],
  ['sutun', '<path d="M6 21V7M10 21V7M14 21V7M18 21V7"/><path d="M4 4h16v3H4zM4 21h16"/>'],
  ['ulduz', '<path d="m12 3 2.7 5.8 6.3.8-4.6 4.4 1.2 6.2L12 17.8 6.4 20.2l1.2-6.2L3 9.6l6.3-.8z"/>'],
  ['tomar', '<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>'],
  ['məşəl', '<path d="M12 3c3 3 4 5 4 7a4 4 0 0 1-8 0c0-2 1-4 4-7z"/><path d="M10 14v7h4v-7"/>']
];

const svgOf = (paths) => `data:image/svg+xml,` + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6FFFBE" ` +
  `stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
);

const cardsArray = ICONS.map(([name, paths]) => ({ name, img: svgOf(paths) }));

/* Fisher–Yates (upstream-in sort(() => 0.5 - Math.random()) üsulu əvəz olundu) */
function shuffle(array) {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const gameGrid = shuffle(cardsArray.concat(cardsArray));

let firstGuess = '';
let secondGuess = '';
let count = 0;
let previousTarget = null;
let delay = 900;
let moves = 0;
let matched = 0;
let finished = false;

const game = document.getElementById('game');
const status = document.getElementById('status');
const grid = document.createElement('section');
grid.setAttribute('class', 'grid');
game.appendChild(grid);

gameGrid.forEach(function (item) {
  const name = item.name;
  const img = item.img;

  const wrapper = document.createElement('div');
  wrapper.className = 'card-wrapper';

  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.name = name;

  const front = document.createElement('div');
  front.classList.add('front');

  const back = document.createElement('div');
  back.classList.add('back');
  back.style.backgroundImage = `url("${img}")`;

  grid.appendChild(card);
  card.appendChild(front);
  card.appendChild(back);
});

const match = function match() {
  const selected = document.querySelectorAll('.selected');
  selected.forEach(function (card) {
    card.classList.add('match');
  });
};

const resetGuesses = function resetGuesses() {
  firstGuess = '';
  secondGuess = '';
  count = 0;
  previousTarget = null;

  const selected = document.querySelectorAll('.selected:not(.match)');
  selected.forEach(function (card) {
    card.classList.remove('selected');
  });
};

function updateStatus() {
  if (status) status.textContent = `${moves} gediş · ${matched / 2} / ${cardsArray.length} cüt`;
}

function finish() {
  finished = true;
  const perfect = cardsArray.length;
  /* Ən az gediş = cüt sayı. Hər əlavə gediş 2 xal alır. */
  const points = Math.max(20, 100 - Math.max(0, moves - perfect) * 2);
  if (status) status.textContent = `Tamamlandı · ${moves} gediş · +${points} xal`;
  try {
    window.parent.postMessage({
      type: 'spartans:result', game: 'memory', won: true, points, moves, pairs: cardsArray.length
    }, '*');
  } catch (_) { /* birbaşa açılanda səssiz */ }
}

grid.addEventListener('click', function (event) {
  if (finished) return;

  const clicked = event.target;

  if (
    clicked.nodeName === 'SECTION' ||
    clicked === previousTarget ||
    clicked.parentNode.classList.contains('selected') ||
    clicked.parentNode.classList.contains('match')
  ) {
    return;
  }

  if (count < 2) {
    count++;
    if (count === 1) {
      firstGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');
    } else {
      secondGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');
    }

    if (firstGuess && secondGuess) {
      moves++;
      updateStatus();
      if (firstGuess === secondGuess) {
        matched += 2;
        setTimeout(match, delay);
        setTimeout(updateStatus, delay);
        if (matched === gameGrid.length) setTimeout(finish, delay + 120);
      }
      setTimeout(resetGuesses, delay);
    }
    previousTarget = clicked;
  }
});

updateStatus();

const restart = document.getElementById('restart');
if (restart) restart.addEventListener('click', () => location.reload());
