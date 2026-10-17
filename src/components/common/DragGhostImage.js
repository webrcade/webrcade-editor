// Native HTML5 drag-and-drop always applies a fixed browser/OS-level
// translucency to whatever image dataTransfer.setDragImage() is given, which
// no CSS/opacity on our end can override — so a normally-styled (dark,
// low-contrast) row washes out into illegibility. This builds a same-shape
// card (drag handle, name, subtitle) in vivid colors instead, sized and
// anchored to the cursor the same way the browser's own default drag image
// would be, and installs it via setDragImage for the given drag event.
export function setDragGhostImage(e, name, subtitle) {
  const rect = e.currentTarget.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  const ghost = document.createElement('div');
  ghost.style.cssText = `position:absolute; top:-1000px; left:-1000px; display:flex; align-items:center; gap:10px; width:${rect.width}px; box-sizing:border-box; padding:10px 14px; background:#1976d2; border-radius:6px; font-family:inherit;`;

  const handle = document.createElement('span');
  handle.textContent = '☰';
  handle.style.cssText = 'color:rgba(255,255,255,0.85); font-size:15px; flex-shrink:0;';

  const textWrap = document.createElement('div');
  textWrap.style.cssText = 'min-width:0;';

  const nameEl = document.createElement('div');
  nameEl.textContent = name;
  nameEl.style.cssText = 'color:#fff; font-size:14px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';

  const subEl = document.createElement('div');
  subEl.textContent = subtitle;
  subEl.style.cssText = 'color:rgba(255,255,255,0.85); font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';

  textWrap.appendChild(nameEl);
  textWrap.appendChild(subEl);
  ghost.appendChild(handle);
  ghost.appendChild(textWrap);
  document.body.appendChild(ghost);
  e.dataTransfer.setDragImage(ghost, offsetX, offsetY);
  setTimeout(() => document.body.removeChild(ghost), 0);
}
