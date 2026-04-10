// Three.js 3D scene manager for Qwirkle board game.
// Managed entirely from JS, receives state from Elm via ports.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createTileMesh, createDropTarget, createSelectionRing } from './tile-geometry.js';

let scene, camera, renderer, controls;
let boardGroup, pendingGroup, dropGroup, rackGroup, glowGroup;
let container = null;
let animationId = null;
let raycaster, mouse;
let mouseDownPos = null;
let hoveredObj = null;
let lastState = null;

// Callbacks to Elm
let onBoardCellClick = null;
let onRackTileClick = null;
let onPendingTileClick = null;

// Glow animation
let glowTiles = [];
let clock = new THREE.Clock();

export function init(containerId, callbacks) {
  container = document.getElementById(containerId);
  if (!container) return;

  onBoardCellClick = callbacks.onBoardCellClick;
  onRackTileClick = callbacks.onRackTileClick;
  onPendingTileClick = callbacks.onPendingTileClick;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f0f1a);

  // Camera
  camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  // Camera facing the player (from behind the rack, looking at the board)
  camera.position.set(0, 10, -12);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false;
  container.appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
  dirLight.position.set(5, 12, 7);
  dirLight.castShadow = false;
  scene.add(dirLight);

  // Casino felt table
  const tableGeom = new THREE.PlaneGeometry(60, 60);
  const feltCanvas = new OffscreenCanvas(512, 512);
  const feltCtx = feltCanvas.getContext('2d');
  // Base green felt color
  feltCtx.fillStyle = '#1a5c2a';
  feltCtx.fillRect(0, 0, 512, 512);
  // Felt texture noise
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const brightness = 20 + Math.random() * 15;
    feltCtx.fillStyle = `rgba(${brightness}, ${60 + Math.random() * 30}, ${brightness + 10}, 0.3)`;
    feltCtx.fillRect(x, y, 1, 1);
  }
  const feltTex = new THREE.CanvasTexture(feltCanvas);
  feltTex.wrapS = THREE.RepeatWrapping;
  feltTex.wrapT = THREE.RepeatWrapping;
  feltTex.repeat.set(4, 4);
  const tableMat = new THREE.MeshStandardMaterial({
    map: feltTex,
    roughness: 0.95,
    metalness: 0.0,
    color: 0x2d8a4e,
  });
  const table = new THREE.Mesh(tableGeom, tableMat);
  table.rotation.x = -Math.PI / 2;
  table.position.y = -0.01;
  scene.add(table);

  // Groups
  boardGroup = new THREE.Group();
  pendingGroup = new THREE.Group();
  dropGroup = new THREE.Group();
  rackGroup = new THREE.Group();
  glowGroup = new THREE.Group();
  scene.add(boardGroup, pendingGroup, dropGroup, rackGroup, glowGroup);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 4;
  controls.maxDistance = 25;
  controls.maxPolarAngle = Math.PI / 2.2;
  controls.target.set(0, 0, 0);

  // Raycasting
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Events
  renderer.domElement.addEventListener('mousedown', onMouseDown);
  renderer.domElement.addEventListener('mouseup', onMouseUp);
  renderer.domElement.addEventListener('mousemove', onMouseMove);

  // Resize
  const ro = new ResizeObserver(() => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(container);

  // Render loop
  animate();
}

export function dispose() {
  if (animationId) cancelAnimationFrame(animationId);
  animationId = null;
  if (renderer) {
    renderer.domElement.removeEventListener('mousedown', onMouseDown);
    renderer.domElement.removeEventListener('mouseup', onMouseUp);
    renderer.domElement.removeEventListener('mousemove', onMouseMove);
    renderer.dispose();
    if (container && renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  }
  if (controls) controls.dispose();
  scene = camera = renderer = controls = null;
  container = null;
  lastState = null;
  glowTiles = [];
}

export function updateState(state) {
  if (!scene) return;
  lastState = state;
  rebuildBoard(state.board, state.lastPlayed);
  rebuildPending(state.pending);
  rebuildDropTargets(state.board, state.pending);
  rebuildRack(state.rack);
  centerCamera(state.board, state.pending);
}

// ── Rebuild functions ──

function rebuildBoard(tiles, lastPlayed) {
  clearGroup(boardGroup);
  clearGroup(glowGroup);
  glowTiles = [];

  for (const t of tiles) {
    const mesh = createTileMesh(t.color, t.shape);
    mesh.position.set(t.x, 0.075, t.y);
    mesh.userData = { type: 'board', x: t.x, y: t.y };
    boardGroup.add(mesh);
  }
}

function rebuildPending(tiles) {
  clearGroup(pendingGroup);
  for (const t of tiles) {
    const mesh = createTileMesh(t.color, t.shape, { transparent: true, opacity: 0.6 });
    mesh.position.set(t.x, 0.075, t.y);
    mesh.userData = { type: 'pending', x: t.x, y: t.y };
    pendingGroup.add(mesh);
  }
}

function rebuildDropTargets(boardTiles, pendingTiles) {
  clearGroup(dropGroup);

  const occupied = new Set();
  for (const t of boardTiles) occupied.add(`${t.x},${t.y}`);
  for (const t of pendingTiles) occupied.add(`${t.x},${t.y}`);

  const candidates = new Set();
  for (const key of occupied) {
    const [x, y] = key.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nk = `${x + dx},${y + dy}`;
      if (!occupied.has(nk)) candidates.add(nk);
    }
  }

  // Empty board: origin
  if (occupied.size === 0) candidates.add('0,0');

  for (const key of candidates) {
    const [x, y] = key.split(',').map(Number);
    const drop = createDropTarget();
    drop.position.set(x, 0.005, y);
    drop.userData = { type: 'drop', x, y };
    dropGroup.add(drop);
  }
}

function rebuildRack(rackTiles) {
  clearGroup(rackGroup);
  if (!rackTiles || rackTiles.length === 0) return;

  const tileSpacing = 1.3;
  const totalWidth = (rackTiles.length - 1) * tileSpacing;
  const startX = -totalWidth / 2;

  // Tray background
  const trayGeom = new THREE.BoxGeometry(totalWidth + 2.0, 0.08, 1.6);
  const trayMat = new THREE.MeshStandardMaterial({
    color: 0x2a3550,
    roughness: 0.9,
  });
  const tray = new THREE.Mesh(trayGeom, trayMat);
  tray.position.set(0, -0.04, 0);
  tray.receiveShadow = true;
  rackGroup.add(tray);

  for (const rt of rackTiles) {
    const isSelected = rt.selected;
    const mesh = createTileMesh(rt.color, rt.shape);
    const xPos = startX + rt.index * tileSpacing;
    mesh.position.set(xPos, isSelected ? 0.15 : 0.075, 0);
    mesh.userData = { type: 'rack', index: rt.index };
    rackGroup.add(mesh);

    if (isSelected) {
      // 3D outline around the tile (no color overlay)
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xe2a03f, linewidth: 3 });
      const outline = new THREE.LineSegments(edges, lineMat);
      outline.position.copy(mesh.position);
      outline.scale.set(1.05, 1.2, 1.05);
      rackGroup.add(outline);
    }
  }

  // Position rack between camera and board (negative Z = toward camera)
  const boardMinZ = lastState && lastState.board.length > 0
    ? Math.min(...lastState.board.map(t => t.y)) - 3
    : -3;

  rackGroup.position.set(0, 0, boardMinZ);
  rackGroup.rotation.set(0, 0, 0);
}

function centerCamera(boardTiles, pendingTiles) {
  const allTiles = [...(boardTiles || []), ...(pendingTiles || [])];
  if (allTiles.length === 0) return;

  let cx = 0, cz = 0;
  for (const t of allTiles) { cx += t.x; cz += t.y; }
  cx /= allTiles.length;
  cz /= allTiles.length;

  // Move orbit target to board centroid
  const target = new THREE.Vector3(cx, 0, cz);
  controls.target.lerp(target, 0.15);

  // Keep camera behind the rack (negative Z relative to board)
  const camTarget = new THREE.Vector3(cx, 10, cz - 12);
  camera.position.lerp(camTarget, 0.1);
}

// ── Animation ──

function animate() {
  animationId = requestAnimationFrame(animate);
  if (!renderer || !scene || !camera) return;

  controls.update();

  renderer.render(scene, camera);
}

// ── Interaction ──

function onMouseDown(e) {
  mouseDownPos = { x: e.clientX, y: e.clientY };
}

function onMouseUp(e) {
  if (!mouseDownPos) return;
  const dx = e.clientX - mouseDownPos.x;
  const dy = e.clientY - mouseDownPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  mouseDownPos = null;

  // Only treat as click if mouse didn't drag (orbit)
  if (dist > 4) return;

  updateMouse(e);
  raycaster.setFromCamera(mouse, camera);

  // Check drop targets first, then pending, then rack
  const dropHits = raycaster.intersectObjects(dropGroup.children);
  if (dropHits.length > 0) {
    const d = dropHits[0].object.userData;
    if (onBoardCellClick) onBoardCellClick({ x: d.x, y: d.y });
    return;
  }

  const pendingHits = raycaster.intersectObjects(pendingGroup.children);
  if (pendingHits.length > 0) {
    const d = pendingHits[0].object.userData;
    if (onPendingTileClick) onPendingTileClick({ x: d.x, y: d.y });
    return;
  }

  const rackHits = raycaster.intersectObjects(rackGroup.children);
  if (rackHits.length > 0) {
    const d = rackHits[0].object.userData;
    if (d.type === 'rack' && onRackTileClick) onRackTileClick(d.index);
    return;
  }
}

function onMouseMove(e) {
  updateMouse(e);

  if (!raycaster || !camera) return;
  raycaster.setFromCamera(mouse, camera);

  // Hover effect on drop targets
  const hits = raycaster.intersectObjects(dropGroup.children);
  if (hoveredObj && hoveredObj !== (hits[0]?.object)) {
    hoveredObj.material.opacity = 0.5;
    hoveredObj.scale.set(1, 1, 1);
    hoveredObj = null;
  }
  if (hits.length > 0) {
    hoveredObj = hits[0].object;
    hoveredObj.material.opacity = 0.9;
    hoveredObj.scale.set(1.1, 1.1, 1.1);
  }
}

function updateMouse(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
}

// ── Helpers ──

function clearGroup(group) {
  while (group.children.length > 0) {
    const child = group.children[0];
    group.remove(child);
    if (child.geometry) child.geometry.dispose();
    if (Array.isArray(child.material)) {
      child.material.forEach(m => m.dispose());
    } else if (child.material) {
      child.material.dispose();
    }
  }
}
