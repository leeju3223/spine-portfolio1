const SPINE_DATA = {
skeleton: 'assets/spine/Illust_Lazuel_PS/Illust_Lazuel_PS.json',
atlas: 'assets/spine/Illust_Lazuel_PS/Illust_Lazuel_PS.atlas'
};

const WORKS = [
  { title: 'Idle — Character Study', type: 'SPINE 2D · LOOP', animation: 'idle', description: 'Lazuel 캐릭터의 기본 대기 동작입니다. 캐릭터의 실루엣과 리듬이 자연스럽게 이어지도록 구성했습니다.' },
  { title: 'Point — Expressive Motion', type: 'SPINE 2D · CHARACTER', animation: 'point', description: 'Lazuel 캐릭터의 포인트 모션입니다. 제스처와 표정의 변화를 Spine 플레이어에서 확인할 수 있습니다.' }
];

let activePlayer = null;
const modal = document.getElementById('workModal');
const playerHost = document.getElementById('spinePlayer');
const placeholder = document.getElementById('playerPlaceholder');

function createPlayer(hostId, animation, controls = false, onError = null) {
  if (!window.spine || !window.spine.SpinePlayer) {
    if (onError) onError('Spine Player 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.');
    return null;
  }
  return new spine.SpinePlayer(hostId, {
    ...SPINE_DATA,
    animation,
    showControls: controls,
    premultipliedAlpha: true,
    alpha: true,
    backgroundColor: '#e7eae200',
    success: player => {
      player.setAnimation(animation, true);
      if (hostId === 'spinePlayer') placeholder.hidden = true;
    },
    error: (_player, reason) => onError && onError(String(reason || 'Spine 데이터를 불러오지 못했습니다.'))
  });
}

function showPlayerError(element, message) {
  element.textContent = message;
  element.hidden = false;
  element.style.display = 'grid';
}

function initPreviews() {
  const heroError = document.getElementById('heroError');
  createPlayer('heroPlayer', 'idle', false, message => showPlayerError(heroError, message));
  createPlayer('idlePreview', 'idle', false, message => showPlayerError(document.getElementById('idlePreview'), message));
  createPlayer('pointPreview', 'point', false, message => showPlayerError(document.getElementById('pointPreview'), message));
}

function openWork(index) {
  const work = WORKS[index];
  if (!work) return;
  document.getElementById('modalTitle').textContent = work.title;
  document.getElementById('modalType').textContent = work.type;
  document.getElementById('modalDescription').textContent = work.description;
  document.getElementById('modalAnimation').textContent = work.animation;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  destroyPlayer();
  placeholder.hidden = true;
  playerHost.classList.add('ready');
  try {
    activePlayer = createPlayer('spinePlayer', work.animation, true, message => {
      placeholder.hidden = false;
      placeholder.querySelector('b').textContent = 'SPINE PLAYER ERROR';
      placeholder.querySelector('small').textContent = message;
      playerHost.classList.remove('ready');
    });
  } catch (error) {
    placeholder.hidden = false;
    placeholder.querySelector('b').textContent = 'PLAYER ERROR';
    placeholder.querySelector('small').textContent = error.message;
    playerHost.classList.remove('ready');
  }
}

function destroyPlayer() {
  if (activePlayer && typeof activePlayer.dispose === 'function') activePlayer.dispose();
  activePlayer = null;
  playerHost.innerHTML = '';
  playerHost.classList.remove('ready');
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  destroyPlayer();
}

document.querySelectorAll('.work-card').forEach(card => {
  const activate = () => openWork(Number(card.dataset.work));
  card.addEventListener('click', activate);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  });
});

document.querySelectorAll('[data-close]').forEach(element => element.addEventListener('click', closeModal));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

window.addEventListener('load', initPreviews);
