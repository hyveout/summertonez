// MANDALA SPINNER — click a petal (or label), the wheel + arrow rotate,
// and the matching panel swaps in.
// Angle system: 0° = 12 o'clock, going clockwise.
//   bio 0° (top) · cd 90° (right) · st 180° (bottom) · ow 270° (left)
const SECTIONS = {
  bio: { rot: 0 },
  cd:  { rot: 90 },
  st:  { rot: 180 },
  ow:  { rot: 270 },
};

const wheel   = document.getElementById('wheel');
const marker  = document.getElementById('marker');
const labels  = {
  bio: document.getElementById('lbl-bio'),
  cd:  document.getElementById('lbl-cd'),
  st:  document.getElementById('lbl-st'),
  ow:  document.getElementById('lbl-ow'),
};
const panels = document.querySelectorAll('.panel');

let currentRot = 0;

function shortestRotation(from, to) {
  const diff = ((to - (from % 360)) + 540) % 360 - 180;
  return from + diff;
}

function select(key) {
  if (!SECTIONS[key]) return;
  currentRot = shortestRotation(currentRot, SECTIONS[key].rot);
  marker.style.transform = `translate(-50%, -50%) rotate(${currentRot}deg)`;
  wheel.style.transform = `rotate(${currentRot}deg)`;

  Object.entries(labels).forEach(([k, el]) => {
    el.classList.toggle('active', k === key);
  });
  panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + key));
}

// Click anywhere on the wheel — the quadrant picks the section
wheel.addEventListener('click', (e) => {
  const rect = wheel.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  let angleDeg = Math.atan2(dy, dx) * 180 / Math.PI + 90;
  if (angleDeg < 0) angleDeg += 360;
  let key;
  if (angleDeg < 45 || angleDeg >= 315) key = 'bio';
  else if (angleDeg < 135) key = 'cd';
  else if (angleDeg < 225) key = 'st';
  else key = 'ow';
  select(key);
});

Object.entries(labels).forEach(([k, el]) => {
  el.addEventListener('click', () => select(k));
});

select('bio');

// START A PROJECT — modal ------------------------------------
const projectOverlay = document.getElementById('projectModalOverlay');
const projectOpenBtn = document.getElementById('startProjectBtn');
const projectCloseBtn = document.getElementById('projectModalClose');
const projectForm = document.getElementById('projectForm');

function openProjectModal() {
  projectOverlay.classList.add('open');
  document.body.classList.add('modal-open');
  document.getElementById('projectName').focus();
}
function closeProjectModal() {
  projectOverlay.classList.remove('open');
  document.body.classList.remove('modal-open');
}

projectOpenBtn.addEventListener('click', openProjectModal);
projectCloseBtn.addEventListener('click', closeProjectModal);
projectOverlay.addEventListener('click', (e) => {
  if (e.target === projectOverlay) closeProjectModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectOverlay.classList.contains('open')) closeProjectModal();
});

projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('projectName').value.trim();
  const email = document.getElementById('projectEmail').value.trim();
  const message = document.getElementById('projectMessage').value.trim();
  const subject = encodeURIComponent(`New project inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:studio@summertonez.com?subject=${subject}&body=${body}`;
  closeProjectModal();
  projectForm.reset();
});
