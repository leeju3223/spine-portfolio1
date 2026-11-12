const WORKS = [
  { title: 'Lazuel — Character Study', type: 'SPINE 2D · ILLUSTRATION', description: '애니메이션을 선택해 재생해보세요.', data: { jsonUrl: 'assets/spine/Illust_Lazuel_PS/Illust_Lazuel_PS.json', atlasUrl: 'assets/spine/Illust_Lazuel_PS/Illust_Lazuel_PS.atlas' }, preview: 'preview-illust', initialAnimation: 'idle', viewportPadding: { horizontal: '8%', top: '8%' } },
  { title: 'Bell', type: 'SPINE 2D · SD CHARACTER', description: 'SD 캐릭터 Bell의 Spine 애니메이션입니다.', data: { binaryUrl: 'assets/spine/SD_Bell/SD_Bell.skel', atlasUrl: 'assets/spine/SD_Bell/SD_Bell.atlas' }, preview: 'preview-sd', viewportPadding: { horizontal: '18%', top: '20%' }, keepHandSword: true },
  { title: 'Hellhedgehog', type: 'SPINE 2D · MONSTER', description: 'Hellhedgehog 몬스터의 Spine 애니메이션입니다.', data: { binaryUrl: 'assets/spine/Monster_Hellhedgehog/2D_Hellhedgehog.skel', atlasUrl: 'assets/spine/Monster_Hellhedgehog/2D_Hellhedgehog.atlas' }, preview: 'preview-monster', viewportPadding: { horizontal: '18%', top: '18%' } }
];

let activePlayer = null;
const modal = document.getElementById('workModal');
const playerHost = document.getElementById('spinePlayer');
const placeholder = document.getElementById('playerPlaceholder');

function createPlayer(hostId, work, controls = false, onError = null, onSuccess = null) {
  if (!window.spine || !window.spine.SpinePlayer) {
    if (onError) onError('Spine Player 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.');
    return null;
  }
  const padding = work.viewportPadding || { horizontal: '8%', top: '8%' };
  const config = {
    ...work.data,
    ...(work.initialAnimation ? { animation: work.initialAnimation } : {}),
    showControls: controls,
    interactive: controls,
    premultipliedAlpha: true,
    alpha: true,
    backgroundColor: '#e7eae200',
    viewport: {
      padLeft: padding.horizontal,
      padRight: padding.horizontal,
      padTop: padding.top,
      padBottom: 0,
      transitionTime: 0.18
    },
    success: player => {
      const animations = player.skeleton.data.animations;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      animations.forEach(animation => {
        player.setViewport(animation);
        const bounds = player.currentViewport;
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
      });
      if (Number.isFinite(minX) && maxX > minX && maxY > minY) {
        Object.assign(config.viewport, { x: minX, y: minY, width: maxX - minX, height: maxY - minY });
      }
      const firstAnimation = work.initialAnimation || animations[0]?.name;
      player.skeleton.setToSetupPose();
      if (firstAnimation) {
        player.setAnimation(firstAnimation, true);
        player.animationState.apply(player.skeleton);
        player.skeleton.updateWorldTransform();
      }
      player.play();
      if (hostId === 'spinePlayer') placeholder.hidden = true;
      if (onSuccess) onSuccess(player);
    },
    update: player => {
      if (work.keepHandSword) keepHandSwordVisible(player.skeleton);
    },
    error: (_player, reason) => onError && onError(String(reason || 'Spine 데이터를 불러오지 못했습니다.'))
  };
  return new spine.SpinePlayer(hostId, config);
}

function keepHandSwordVisible(skeleton) {
  const slot = skeleton.findSlot('blade');
  if (!slot) return;

  const sword = skeleton.getAttachment(slot.data.index, 'blade');
  if (sword && slot.getAttachment() !== sword) slot.setAttachment(sword);
  slot.color.a = 1;

  const order = skeleton.drawOrder;
  const currentIndex = order.indexOf(slot);
  if (currentIndex >= 0 && currentIndex !== order.length - 1) {
    order.splice(currentIndex, 1);
    order.push(slot);
  }
}

function showPlayerError(element, message) {
  element.textContent = message;
  element.hidden = false;
  element.style.display = 'grid';
}

function initPreviews() {
  WORKS.forEach(work => createPlayer(work.preview, work, false, message => showPlayerError(document.getElementById(work.preview), message)));
}

function openWork(index) {
  const work = WORKS[index];
  if (!work) return;
  document.getElementById('modalTitle').textContent = work.title;
  document.getElementById('modalType').textContent = work.type;
  document.getElementById('modalDescription').textContent = work.description;
  document.getElementById('animationList').innerHTML = '<small>애니메이션 목록을 불러오는 중입니다.</small>';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  destroyPlayer();
  placeholder.hidden = true;
  playerHost.classList.add('ready');
  try {
    activePlayer = createPlayer('spinePlayer', work, false, message => {
      placeholder.hidden = false;
      placeholder.querySelector('b').textContent = 'SPINE PLAYER ERROR';
      placeholder.querySelector('small').textContent = message;
      playerHost.classList.remove('ready');
      document.getElementById('animationList').innerHTML = '<small>애니메이션을 불러오지 못했습니다.</small>';
    }, player => {
      const list = document.getElementById('animationList');
      const animations = player.skeleton.data.animations;
      list.replaceChildren();
      if (!animations.length) {
        list.innerHTML = '<small>등록된 애니메이션이 없습니다.</small>';
        return;
      }
      animations.forEach((animation, animationIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'animation-option';
        button.textContent = animation.name;
        button.setAttribute('aria-pressed', String(animation.name === (work.initialAnimation || animations[0].name)));
        button.addEventListener('click', () => {
          if (!activePlayer) return;
          activePlayer.animationState.setAnimation(0, animation.name, true);
          activePlayer.play();
          list.querySelectorAll('.animation-option').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        });
        list.append(button);
      });
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

window.addEventListener('load', initPreviews);
