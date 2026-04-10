// Tile mesh factory with canvas texture generation for Qwirkle 3D view.
// Generates 36 textures (6 colors x 6 shapes) on OffscreenCanvas, cached as THREE.CanvasTexture.

import * as THREE from 'three';

const COLORS = {
  Green:  '#2ecc71',
  Blue:   '#3498db',
  Purple: '#9b59b6',
  Red:    '#e74c3c',
  Orange: '#e67e22',
  Yellow: '#f1c40f',
};

const TILE_BG = '#16213e';
const TILE_SIDE = '#1e2a47';
const TEX_SIZE = 256;
const HALF = TEX_SIZE / 2;

const textureCache = new Map();

function getTexture(color, shape) {
  const key = `${color}_${shape}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const canvas = new OffscreenCanvas(TEX_SIZE, TEX_SIZE);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = TILE_BG;
  roundRect(ctx, 0, 0, TEX_SIZE, TEX_SIZE, 16);
  ctx.fill();

  // Shape
  ctx.fillStyle = COLORS[color] || '#ffffff';
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  drawShape(ctx, shape, HALF, HALF, TEX_SIZE * 0.35);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, tex);
  return tex;
}

function drawShape(ctx, shape, cx, cy, r) {
  ctx.beginPath();
  switch (shape) {
    case 'Circle':
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;

    case 'Square': {
      const s = r * 0.85;
      ctx.rect(cx - s, cy - s, s * 2, s * 2);
      break;
    }

    case 'Diamond':
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r, cy);
      ctx.closePath();
      break;

    case 'Clover': {
      const cr = r * 0.38;
      const off = r * 0.35;
      // Four circles
      for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
        ctx.moveTo(cx + dx * off + cr, cy + dy * off);
        ctx.arc(cx + dx * off, cy + dy * off, cr, 0, Math.PI * 2);
      }
      // Center
      ctx.moveTo(cx + cr * 0.5, cy);
      ctx.arc(cx, cy, cr * 0.5, 0, Math.PI * 2);
      break;
    }

    case 'FourPointStar':
      drawStar(ctx, cx, cy, 4, r, r * 0.35);
      break;

    case 'EightPointStar':
      drawStar(ctx, cx, cy, 8, r, r * 0.55);
      break;

    default:
      ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
}

function drawStar(ctx, cx, cy, points, outerR, innerR) {
  const step = Math.PI / points;
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < points * 2; i++) {
    const angle = -Math.PI / 2 + i * step;
    const radius = i % 2 === 0 ? outerR : innerR;
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
  }
  ctx.closePath();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Create materials array for BoxGeometry (order: +x, -x, +y, -y, +z, -z)
function createTileMaterials(color, shape, opts = {}) {
  const topTex = getTexture(color, shape);
  const sideMat = new THREE.MeshStandardMaterial({
    color: TILE_SIDE,
    roughness: 0.7,
    transparent: opts.transparent || false,
    opacity: opts.opacity ?? 1.0,
  });
  const topMat = new THREE.MeshStandardMaterial({
    map: topTex,
    roughness: 0.4,
    transparent: opts.transparent || false,
    opacity: opts.opacity ?? 1.0,
  });

  if (opts.emissive) {
    topMat.emissive = new THREE.Color(opts.emissive);
    topMat.emissiveIntensity = opts.emissiveIntensity || 0.3;
  }

  // BoxGeometry face order: +x, -x, +y(top), -y(bottom), +z, -z
  return [sideMat, sideMat, topMat, sideMat, sideMat, sideMat];
}

const tileGeom = new THREE.BoxGeometry(0.92, 0.15, 0.92);

export function createTileMesh(color, shape, opts = {}) {
  const materials = createTileMaterials(color, shape, opts);
  const mesh = new THREE.Mesh(tileGeom, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Drop target: flat transparent square
const dropGeom = new THREE.PlaneGeometry(0.88, 0.88);

export function createDropTarget() {
  const canvas = new OffscreenCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgba(226, 160, 63, 0.4)';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(4, 4, 56, 56);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(dropGeom, mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

// Selection highlight ring for rack
export function createSelectionRing() {
  const geom = new THREE.RingGeometry(0.52, 0.58, 4);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xe2a03f,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}
