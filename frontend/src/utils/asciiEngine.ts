// High-Density Realistic Botanical ASCII Rasterizer & Generator
// Directly inspired by the reference photo: multi-layered lilies, sunflowers, daisies, tulips,
// with fine scanline/character matrix on pitch black background and rich emerald stem spray.

export type FlowerSpecies = 'sunflower' | 'daisy' | 'lily' | 'tulip' | 'lavender';

export type AsciiPaletteMode =
  | 'reference'    // Exact match to user reference: Ruby, Magenta, Cream White, Amber, Emerald
  | 'emerald'      // Luminescent emerald/cyan glow with golden core
  | 'monochrome'   // Pure white/silver starlight wireframe characters
  | 'amber'        // Warm golden phosphor glow
  | 'amethyst';    // Violet & pastel lavender glow

export interface BouquetComposition {
  sunflower: number;
  daisy: number;
  lily: number;
  tulip: number;
  lavender: number;
  density: 'ultra' | 'fine' | 'medium';
  renderStyle: 'scanline' | 'matrix' | 'dense' | 'fine';
}

export interface RenderOptions {
  width: number;       // character columns (e.g. 150 - 200)
  height: number;      // character rows (e.g. 80 - 110)
  paletteMode: AsciiPaletteMode;
  charDensity: 'fine' | 'matrix' | 'dense' | 'scanline';
  glowIntensity: number;
}

// Character ramps
const RAMPS = {
  scanline: ' ─═━≡░▒▓█', // horizontal scanline look matching reference photo!
  matrix: ' .·:+*#%@',
  dense: ' .,:;i1tfLCG08@#',
  fine: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
};

export interface AsciiCell {
  char: string;
  r: number;
  g: number;
  b: number;
  a: number;
  brightness: number;
}

export interface AsciiGridResult {
  grid: AsciiCell[][];
  plainText: string;
  width: number;
  height: number;
}

/**
 * Botanical Vector Renderer: Accurately paints the floral bouquet matching the reference image
 */
export class BotanicalCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(width = 500, height = 620) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    const context = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Could not get 2d context');
    this.ctx = context;
  }

  public setSize(w: number, h: number) {
    this.canvas.width = w;
    this.canvas.height = h;
  }

  public clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw 6-Petaled Flared Stargazer Lily (matching reference image)
   * Detailed flared pointed tepals with fine striations and central rib lines
   */
  public drawLily(
    cx: number,
    cy: number,
    scale: number,
    rot: number,
    petalColor: string,
    ribColor: string,
    throatColor: string,
    showStamens = true
  ) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    const tepalAngles = [
      -Math.PI / 2,                  // Top
      -Math.PI / 2 + (Math.PI * 2) / 6,
      -Math.PI / 2 + (Math.PI * 4) / 6,
      Math.PI / 2,                   // Bottom
      Math.PI / 2 + (Math.PI * 2) / 6,
      Math.PI / 2 + (Math.PI * 4) / 6,
    ];

    // Petals
    tepalAngles.forEach((angle, idx) => {
      ctx.save();
      ctx.rotate(angle);
      const isInner = idx % 2 === 0;
      const len = isInner ? 92 : 82;
      const w = isInner ? 36 : 28;

      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.bezierCurveTo(-w, 30, -w * 0.8, len * 0.72, 0, len);
      ctx.bezierCurveTo(w * 0.8, len * 0.72, w, 30, 0, 10);
      ctx.closePath();
      ctx.fillStyle = petalColor;
      ctx.fill();

      // Horizontal scanline striations for fine texture
      ctx.strokeStyle = ribColor;
      ctx.lineWidth = 1;
      for (let yStep = 20; yStep < len - 10; yStep += 4) {
        const span = (1 - (yStep / len)) * (w * 0.7);
        ctx.beginPath();
        ctx.moveTo(-span, yStep);
        ctx.lineTo(span, yStep);
        ctx.stroke();
      }

      // Central dark rib
      ctx.strokeStyle = ribColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, len - 6);
      ctx.stroke();

      ctx.restore();
    });

    // Central Throat Glow
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fillStyle = throatColor;
    ctx.fill();

    // Stamens & Anthers
    if (showStamens) {
      for (let s = 0; s < 6; s++) {
        const sAngle = (s * Math.PI * 2) / 6 + 0.2;
        ctx.save();
        ctx.rotate(sAngle);
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.quadraticCurveTo(8, 20, 12, 42);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.3;
        ctx.stroke();

        ctx.translate(12, 42);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-3, -2, 6, 4);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  /**
   * Draw Radiant Sunflower (fibonacci seed disk, golden ray florets)
   */
  public drawSunflower(cx: number, cy: number, scale = 1.0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const petalCount = 32;
    const outerR = 92;
    const innerR = 40;

    // Layer 1: Outer golden rays
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 2 * Math.PI) / petalCount;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, innerR);
      ctx.bezierCurveTo(-14, innerR + 25, -10, outerR - 5, 0, outerR);
      ctx.bezierCurveTo(10, outerR - 5, 14, innerR + 25, 0, innerR);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? '#ffb300' : '#f59e0b';
      ctx.fill();

      // Scanline shading
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, innerR + 5);
      ctx.lineTo(0, outerR - 6);
      ctx.stroke();
      ctx.restore();
    }

    // Layer 2: Inner rays
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 2 * Math.PI) / petalCount + Math.PI / petalCount;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, innerR - 4);
      ctx.bezierCurveTo(-10, innerR + 15, -7, outerR * 0.86, 0, outerR * 0.86);
      ctx.bezierCurveTo(7, outerR * 0.86, 10, innerR + 15, 0, innerR - 4);
      ctx.closePath();
      ctx.fillStyle = '#fde047';
      ctx.fill();
      ctx.restore();
    }

    // Central Fibonacci Disc
    const floretCount = 240;
    const goldenAngle = 2.39996323;
    for (let n = 1; n <= floretCount; n++) {
      const r = 2.4 * Math.sqrt(n);
      const theta = n * goldenAngle;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);

      ctx.beginPath();
      ctx.arc(x, y, 1.4 + (r / innerR) * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = r / innerR > 0.8 ? '#b45309' : r / innerR > 0.4 ? '#78350f' : '#3f1d0b';
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Draw Upright Tulip / Cup Bloom (matching reference image top flanks)
   */
  public drawTulipBud(cx: number, cy: number, scale = 1.0, color = '#fef08a', stemH = 120) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Thin vertical stem
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, stemH);
    ctx.stroke();

    // Cup Goblet
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.bezierCurveTo(-26, -15, -20, -60, 0, -70);
    ctx.bezierCurveTo(20, -60, 26, -15, 0, 10);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Petal separation lines
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-10, 5);
    ctx.quadraticCurveTo(-15, -30, -5, -65);
    ctx.moveTo(10, 5);
    ctx.quadraticCurveTo(15, -30, 5, -65);
    ctx.stroke();

    ctx.restore();
  }

  public drawTulip(cx: number, cy: number, scale = 1.0, color = '#fef08a', stemH = 140) {
    this.drawTulipBud(cx, cy, scale, color, stemH);
  }

  public drawDaisy(cx: number, cy: number, scale = 1.0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const stemH = 160;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, stemH);
    ctx.stroke();

    const petalCount = 24;
    const outerR = 75;
    const innerR = 24;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 2 * Math.PI) / petalCount;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, innerR);
      ctx.bezierCurveTo(-7, innerR + 15, -6, outerR - 4, 0, outerR);
      ctx.bezierCurveTo(6, outerR - 4, 7, innerR + 15, 0, innerR);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#f1f5f9';
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();

    ctx.restore();
  }

  public drawLavender(cx: number, cy: number, scale = 1.0, color = '#c084fc', stemH = 160) {
    this.drawLavenderSpike(cx, cy, scale, color, stemH);
  }

  /**
   * Draw Lavender Spike / Bud Stalk (reference image top vertical buds)
   */
  public drawLavenderSpike(cx: number, cy: number, scale = 1.0, color = '#c084fc', stemH = 140) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, stemH);
    ctx.stroke();

    const buds = 9;
    for (let b = 0; b < buds; b++) {
      const by = -b * 8;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(-5, by, 4, 3, -0.4, 0, Math.PI * 2);
      ctx.ellipse(5, by, 4, 3, 0.4, 0, Math.PI * 2);
      ctx.ellipse(0, by - 2, 3, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Draw Dense Emerald Stem & Leaf Spray (matching reference image base)
   */
  public drawStemSpray(cx: number, baseY: number, width = 160, height = 150) {
    const ctx = this.ctx;
    ctx.save();

    // Stems converging downward
    const stemCount = 26;
    for (let i = 0; i < stemCount; i++) {
      const startX = cx + ((i - stemCount / 2) / (stemCount / 2)) * (width * 0.9);
      const startY = baseY;
      const endX = cx + ((i - stemCount / 2) / (stemCount / 2)) * (width * 0.35);
      const endY = baseY + height;

      ctx.strokeStyle = i % 2 === 0 ? '#10b981' : '#059669';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        cx + (startX - cx) * 0.6,
        baseY + height * 0.5,
        endX,
        endY
      );
      ctx.stroke();

      // Slender side leaf blades along stems
      if (i % 3 === 0) {
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        const midY = baseY + height * 0.4 + (i % 5) * 8;
        const midX = cx + (startX - cx) * 0.6;
        const dir = i < stemCount / 2 ? -1 : 1;
        ctx.ellipse(midX + dir * 18, midY, 20, 4, dir * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /**
   * The Master Bouquet Composition:
   * Accurately reproduces the arrangement, color balance, and density of the user's reference image!
   */
  public drawReferenceBouquet(comp: BouquetComposition) {
    const ctx = this.ctx;
    this.clear();

    const cx = this.canvas.width / 2;
    const cy = 250;

    // 1. Tall Background Buds & Upright Stalks (Top layer)
    // Left & Right Lavender & Tulip buds reaching into darkness
    this.drawLavenderSpike(cx - 30, cy - 145, 0.9, '#a855f7', 180);
    this.drawLavenderSpike(cx + 35, cy - 140, 0.9, '#c084fc', 180);
    this.drawTulipBud(cx - 70, cy - 110, 0.85, '#e2e8f0', 160); // Silver/white upright bud
    this.drawTulipBud(cx + 85, cy - 105, 0.85, '#fde047', 160); // Golden yellow upright bud

    // 2. High Center: Deep Crimson / Ruby Stargazer Lily (The stunning red star on top)
    this.drawLily(
      cx,
      cy - 80,
      0.98,
      0,
      '#e11d48', // Ruby red tepals
      '#9f1239', // Dark burgundy central rib
      '#facc15', // Golden throat
      true
    );

    // 3. Flanking Side Blooms:
    // Left Mid: Golden Yellow Blossom
    this.drawLily(
      cx - 100,
      cy - 20,
      0.68,
      -0.25,
      '#eab308', // Warm gold
      '#a16207',
      '#ca8a04',
      false
    );

    // Right Mid: Magenta / Purple Bloom
    this.drawLily(
      cx + 105,
      cy - 25,
      0.65,
      0.25,
      '#c026d3', // Fuchsia / magenta
      '#86198f',
      '#facc15',
      false
    );

    // Lower Left Flank: Bright Yellow Side Flower
    this.drawLily(
      cx - 115,
      cy + 105,
      0.58,
      -0.4,
      '#facc15',
      '#ca8a04',
      '#713f12',
      false
    );

    // Lower Right Flank: Crimson Accent Flower
    this.drawLily(
      cx + 115,
      cy + 120,
      0.55,
      0.35,
      '#dc2626',
      '#991b1b',
      '#fef08a',
      false
    );

    // 4. Focal Mid Row:
    // Left: Radiant Purple/Violet Stargazer Lily
    this.drawLily(
      cx - 55,
      cy + 30,
      1.05,
      -0.12,
      '#db2777', // Vivid magenta / orchid pink
      '#9d174d', // Deep wine rib
      '#fef08a',
      true
    );

    // Right: Luminous Pearlescent White / Cream Stargazer Lily
    this.drawLily(
      cx + 55,
      cy + 40,
      1.05,
      0.15,
      '#f8fafc', // Pearlescent white
      '#cbd5e1', // Soft silver-grey rib
      '#facc15', // Golden core
      true
    );

    // 5. Lower Centerpiece: Warm Amber Golden Sunflower / Lily
    // If sunflower requested, render radiant sunflower disk; otherwise warm amber bloom
    if (comp.sunflower > 0) {
      this.drawSunflower(cx, cy + 115, 0.95);
    } else {
      this.drawLily(
        cx,
        cy + 115,
        0.98,
        0.05,
        '#d97706', // Warm amber / golden
        '#78350f',
        '#fef08a',
        true
      );
    }

    // 6. Base Layer: Rich Emerald Stem & Leaf Spray
    this.drawStemSpray(cx, cy + 180, 170, 160);

    // 7. Stardust Particle Spray along the silhouette (Image 1 & 2 inspired)
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 55; i++) {
      const px = cx + (Math.random() - 0.5) * 340;
      const py = cy + (Math.random() - 0.5) * 440;
      ctx.fillRect(px, py, 1.4, 1.4);
    }
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}

/**
 * High-Density Rasterizer: Converts the high-resolution vector canvas into fine-pixel ASCII
 */
export function rasterizeBouquet(
  sourceCanvas: HTMLCanvasElement,
  options: RenderOptions
): AsciiGridResult {
  const { width, height, paletteMode, charDensity } = options;
  const ramp = RAMPS[charDensity] || RAMPS.scanline;

  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = width;
  sampleCanvas.height = height;
  const sCtx = sampleCanvas.getContext('2d');
  if (!sCtx) throw new Error('Could not get sample context');

  sCtx.drawImage(sourceCanvas, 0, 0, width, height);
  const imgData = sCtx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const grid: AsciiCell[][] = [];
  const textLines: string[] = [];

  for (let y = 0; y < height; y++) {
    const row: AsciiCell[] = [];
    let textLine = '';

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];
      const a = data[idx + 3] / 255;

      const brightness = ((0.299 * r + 0.587 * g + 0.114 * b) / 255) * a;

      let char = ' ';
      if (brightness > 0.05) {
        const rampIdx = Math.min(
          ramp.length - 1,
          Math.floor(brightness * ramp.length)
        );
        char = ramp[rampIdx];
      }

      // Apply Palette Mode
      if (paletteMode === 'monochrome') {
        const val = Math.floor(brightness * 255);
        r = val;
        g = val;
        b = val;
      } else if (paletteMode === 'emerald') {
        if (brightness > 0.65) {
          r = 255;
          g = 240;
          b = 150;
        } else {
          r = Math.floor(35 * brightness);
          g = Math.floor(240 * brightness + 20);
          b = Math.floor(170 * brightness + 15);
        }
      } else if (paletteMode === 'amber') {
        r = Math.floor(255 * brightness);
        g = Math.floor(180 * brightness);
        b = Math.floor(25 * brightness);
      } else if (paletteMode === 'amethyst') {
        r = Math.floor(215 * brightness + 25);
        g = Math.floor(115 * brightness);
        b = Math.floor(255 * brightness);
      }
      // If 'reference', retain the exact authentic RGB colors from the bouquet drawing!

      row.push({ char, r, g, b, a, brightness });
      textLine += char;
    }

    grid.push(row);
    textLines.push(textLine);
  }

  return {
    grid,
    plainText: textLines.join('\n'),
    width,
    height,
  };
}
