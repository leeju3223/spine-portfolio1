// positionOffset is per work: x > 0 moves the character right, y > 0 moves it up.
// Values are fractions of the viewport (0.05 = 5% of the frame).
const WORKS = [
  {
    title: 'Lazuel — Character Study',
    type: 'SPINE 2D · ILLUSTRATION',
    description: '애니메이션을 선택해 재생해보세요.',
    data: {
      jsonUrl: 'assets/spine/Illust_Lazuel_PS/Illust_Lazuel_PS.json',
      atlasUrl: 'assets/spine/Illust_Lazuel_PS/Illust_Lazuel_PS.atlas'
    },
    preview: 'preview-illust',
    initialAnimation: 'idle',
    viewportPadding: { horizontal: '8%', top: '8%' },
    positionOffset: { x: 0, y: 0.1 },
    characterZoom: 1.2
  },
  {
    title: 'Kasira',
    type: 'SPINE 2D · ILLUSTRATION',
    description: 'Spine 일러스트 Kasira의 애니메이션입니다.',
    data: {
      binaryUrl: 'assets/spine/Illust_Kasira_PS/Illust_Kasira_PS.skel.bytes',
      atlasUrl: 'assets/spine/Illust_Kasira_PS/Illust_Kasira_PS.atlas.txt'
    },
    preview: 'preview-illust-kasira',
    viewportPadding: { horizontal: '8%', top: '8%' },
    positionOffset: { x: 0, y: 0.1 },
    characterZoom: 1.2
  },
  {
    title: 'Keneth New Year 2026',
    type: 'SPINE 2D · ILLUSTRATION',
    description: 'Keneth New Year 2026 Spine 일러스트입니다.',
    data: {
      jsonUrl: 'assets/spine/Illust_KenethNewYear2026_PS/Illust_KenethNewYear2026_PS.json',
      atlasUrl: 'assets/spine/Illust_KenethNewYear2026_PS/Illust_KenethNewYear2026_PS.atlas'
    },
    preview: 'preview-illust-keneth',
    viewportPadding: { horizontal: '8%', top: '8%' },
    positionOffset: { x: 0, y: -0.2 },
    characterZoom: 1.85
  },
  {
    title: 'Penny',
    type: 'SPINE 2D · ILLUSTRATION',
    description: 'Spine 일러스트 Penny의 애니메이션입니다.',
    data: {
      binaryUrl: 'Illust_Penny_PS/Illust_Penny_PS.skel.bytes',
      atlasUrl: 'Illust_Penny_PS/Illust_Penny_PS.atlas.txt'
    },
    preview: 'preview-illust-penny',
    viewportPadding: { horizontal: '8%', top: '8%' },
    positionOffset: { x: 0, y: 0.05 },
    characterZoom: 1.6
  },
  {
    title: 'Bell',
    type: 'SPINE 2D · SD CHARACTER',
    description: 'SD 캐릭터 Bell의 Spine 애니메이션입니다.',
    data: {
      binaryUrl: 'SD_Bell/SD_Bell.skel.bytes',
      atlasUrl: 'assets/spine/SD_Bell/SD_Bell.atlas'
    },
    preview: 'preview-sd',
    viewportPadding: { horizontal: '18%', top: '20%', bottom: '3%' },
    characterFrameFill: 0.4,
    characterZoom: 2.5
  },
  {
    title: 'PopoMayor',
    type: 'SPINE 2D · SD CHARACTER',
    description: 'SD 캐릭터 PopoMayor의 Spine 애니메이션입니다.',
    data: {
      binaryUrl: 'SD_PopoMayor/SD_PopoMayor.skel.bytes',
      atlasUrl: 'SD_PopoMayor/SD_PopoMayor.atlas.txt'
    },
    preview: 'preview-popo-mayor',
    viewportPadding: { horizontal: '18%', top: '20%', bottom: '3%' },
    characterFrameFill: 0.4,
    characterZoom: 2.5
  },
  {
    title: 'Hellhedgehog',
    type: 'SPINE 2D · MONSTER',
    description: 'Hellhedgehog 몬스터의 Spine 애니메이션입니다.',
    data: {
      binaryUrl: 'assets/spine/Monster_Hellhedgehog/2D_Hellhedgehog.skel',
      atlasUrl: 'assets/spine/Monster_Hellhedgehog/2D_Hellhedgehog.atlas'
    },
    preview: 'preview-monster',
    viewportPadding: { horizontal: '18%', top: '18%', bottom: '3%' },
    characterFrameFill: 0.4,
    characterZoom: 2
  },
  {
    title: 'UI_Victory',
    type: 'SPINE 2D · UI',
    description: 'Victory UI Spine 애니메이션입니다.',
    data: {
      binaryUrl: 'assets/spine/UI_Victory/UI_Victory.skel.bytes',
      atlasUrl: 'assets/spine/UI_Victory/UI_Victory.atlas'
    },
    preview: 'preview-ui-victory',
    viewportPadding: { horizontal: '8%', top: '8%' },
    positionOffset: { x: 0, y: -0 },
    characterZoom: 1
  },
  {
    title: 'UI_Defeat',
    type: 'SPINE 2D · UI',
    description: 'Defeat UI Spine 애니메이션입니다.',
    data: {
      binaryUrl: 'assets/spine/UI_Defeat/UI_Defeat.skel.bytes',
      atlasUrl: 'assets/spine/UI_Defeat/UI_Defeat.atlas.txt'
    },
    preview: 'preview-ui-defeat',
    viewportPadding: { horizontal: '8%', top: '8%' },
    positionOffset: { x: 0, y: 0 },
    characterZoom: 1
  }
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
      padLeft: work.characterFrameFill ? '0%' : padding.horizontal,
      padRight: work.characterFrameFill ? '0%' : padding.horizontal,
      padTop: work.characterFrameFill ? '0%' : padding.top,
      padBottom: work.characterFrameFill ? '0%' : (padding.bottom || 0),
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
      const firstAnimation = work.initialAnimation || animations[0]?.name;
      player.skeleton.setToSetupPose();
      player.skeleton.updateWorldTransform();
      const rootBone = player.skeleton.findBone('root') || player.skeleton.bones.find(bone => !bone.parent);
      const floorY = rootBone ? rootBone.worldY : minY;
      const positionOffset = work.positionOffset || { x: 0, y: 0 };
      if (Number.isFinite(minX) && Number.isFinite(floorY) && maxX > minX && maxY > floorY) {
        // Use full animation bounds for zoom. The root bone is the floor anchor,
        // but its height within the bounds can differ between rigs.
        const characterHeight = maxY - minY;
        const characterWidth = maxX - minX;
        if (work.characterFrameFill) {
          const host = document.getElementById(hostId);
          const aspect = host.clientWidth / host.clientHeight || 1;
          const baseViewHeight = Math.max(characterHeight / work.characterFrameFill, characterWidth / (aspect * 0.9));
          const viewHeight = baseViewHeight / (work.characterZoom || 1);
          const viewWidth = viewHeight * aspect;
          const centerX = (minX + maxX) / 2;
          const floorGap = viewHeight * 0.03;
          Object.assign(config.viewport, {
            x: centerX - viewWidth / 2 - (positionOffset.x || 0) * viewWidth,
            y: floorY - floorGap - (positionOffset.y || 0) * viewHeight,
            width: viewWidth,
            height: viewHeight
          });
        } else {
          const zoom = work.characterZoom || 1;
          const viewWidth = characterWidth / zoom;
          const viewHeight = characterHeight / zoom;
          Object.assign(config.viewport, {
            x: minX + (characterWidth - viewWidth) / 2 - (positionOffset.x || 0) * viewWidth,
            y: floorY - (positionOffset.y || 0) * viewHeight,
            width: viewWidth,
            height: viewHeight
          });
        }
      }
      if (firstAnimation) {
        player.setAnimation(firstAnimation, true);
        player.animationState.apply(player.skeleton);
        player.skeleton.updateWorldTransform();
      }
      player.play();
      if (hostId === 'spinePlayer') placeholder.hidden = true;
      if (onSuccess) onSuccess(player);
    },
    error: (_player, reason) => onError && onError(String(reason || 'Spine 데이터를 불러오지 못했습니다.'))
  };
  return new spine.SpinePlayer(hostId, config);
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
