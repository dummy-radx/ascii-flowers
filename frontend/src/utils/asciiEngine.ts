// High-Density Realistic Botanical ASCII Rasterizer & Generator
// Directly inspired by the reference photo: multi-layered lilies, sunflowers, daisies, tulips,
// with fine scanline/character matrix on pitch black background, blooming animation physics,
// and gifts (plushies, chocolates, lockets) plus glowing ASCII typography!

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
  bloomProgress?: number; // 0.0 (closed sprout) to 1.0 (full majestic bloom)
  floatingMessage?: string; // e.g. "I LOVE YOU SREEPARNA"
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
  isOverlay?: boolean;
}

export interface StampedOverlay {
  text: string;
  gridX: number;
  gridY: number;
  align: 'center' | 'left' | 'right';
  colorStr: string;
  isTitle: boolean;
  isSubtitle: boolean;
}

export interface AsciiGridResult {
  grid: AsciiCell[][];
  plainText: string;
  width: number;
  height: number;
  stampedOverlays?: StampedOverlay[];
}

export interface AsciiTextOverlay {
  text: string;
  canvasX: number;
  canvasY: number;
  color?: string;
  align?: 'center' | 'left' | 'right';
}

/**
 * Botanical Vector Renderer: Accurately paints flowers, bouquets, plushies, chocolates,
 * and glowing romantic ASCII banners
 */
export class BotanicalCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private textOverlays: AsciiTextOverlay[] = [];

  constructor(width = 520, height = 640) {
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
    this.textOverlays = [];
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public addTextOverlay(overlay: AsciiTextOverlay) {
    this.textOverlays.push(overlay);
  }

  public getTextOverlays(): AsciiTextOverlay[] {
    return this.textOverlays;
  }

  /**
   * Draw 6-Petaled Flared Stargazer Lily with Bloom Animation Support
   */
  public drawLily(
    cx: number,
    cy: number,
    scale: number,
    rot: number,
    petalColor: string,
    ribColor: string,
    throatColor: string,
    showStamens = true,
    bloom = 1.0
  ) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Dynamic scale based on bloom progress
    const effectiveScale = scale * (0.35 + 0.65 * bloom);
    ctx.scale(effectiveScale, effectiveScale);

    const tepalAngles = [
      -Math.PI / 2,                  // Top
      -Math.PI / 2 + (Math.PI * 2) / 6,
      -Math.PI / 2 + (Math.PI * 4) / 6,
      Math.PI / 2,                   // Bottom
      Math.PI / 2 + (Math.PI * 2) / 6,
      Math.PI / 2 + (Math.PI * 4) / 6,
    ];

    // Petals expand outwards as bloom increases
    tepalAngles.forEach((angle, idx) => {
      ctx.save();
      ctx.rotate(angle);
      const isInner = idx % 2 === 0;
      const maxLen = isInner ? 92 : 82;
      const maxW = isInner ? 36 : 28;

      const len = maxLen * (0.3 + 0.7 * bloom);
      const w = maxW * (0.2 + 0.8 * bloom);

      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.bezierCurveTo(-w, 20 + 10 * bloom, -w * 0.8, len * 0.72, 0, len);
      ctx.bezierCurveTo(w * 0.8, len * 0.72, w, 20 + 10 * bloom, 0, 8);
      ctx.closePath();
      ctx.fillStyle = bloom < 0.3 ? '#059669' : petalColor;
      ctx.fill();

      if (bloom > 0.4) {
        // Horizontal scanline striations for fine texture
        ctx.strokeStyle = ribColor;
        ctx.lineWidth = 1;
        for (let yStep = 18; yStep < len - 8; yStep += 4) {
          const span = (1 - (yStep / len)) * (w * 0.7);
          ctx.beginPath();
          ctx.moveTo(-span, yStep);
          ctx.lineTo(span, yStep);
          ctx.stroke();
        }

        // Central dark rib
        ctx.strokeStyle = ribColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.lineTo(0, len - 4);
        ctx.stroke();
      }

      ctx.restore();
    });

    // Central Throat Glow
    if (bloom > 0.3) {
      ctx.beginPath();
      ctx.arc(0, 0, 14 * bloom, 0, Math.PI * 2);
      ctx.fillStyle = throatColor;
      ctx.fill();
    }

    // Stamens & Anthers emerge when blooming
    if (showStamens && bloom > 0.6) {
      const stamenGrowth = (bloom - 0.6) / 0.4;
      for (let s = 0; s < 6; s++) {
        const sAngle = (s * Math.PI * 2) / 6 + 0.2;
        ctx.save();
        ctx.rotate(sAngle);
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.quadraticCurveTo(8 * stamenGrowth, 20 * stamenGrowth, 12 * stamenGrowth, 42 * stamenGrowth);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.translate(12 * stamenGrowth, 42 * stamenGrowth);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-3, -2, 6, 4);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  /**
   * Draw Radiant Sunflower with Bloom Support
   */
  public drawSunflower(cx: number, cy: number, scale = 1.0, bloom = 1.0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const effScale = scale * (0.3 + 0.7 * bloom);
    ctx.scale(effScale, effScale);

    const petalCount = 32;
    const outerR = 92 * bloom;
    const innerR = 40 * (0.4 + 0.6 * bloom);

    if (bloom > 0.2) {
      // Outer golden rays
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * 2 * Math.PI) / petalCount;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, innerR);
        ctx.bezierCurveTo(-14 * bloom, innerR + 25 * bloom, -10 * bloom, outerR - 5, 0, outerR);
        ctx.bezierCurveTo(10 * bloom, outerR - 5, 14 * bloom, innerR + 25 * bloom, 0, innerR);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? '#ffb300' : '#f59e0b';
        ctx.fill();

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, innerR + 5);
        ctx.lineTo(0, outerR - 6);
        ctx.stroke();
        ctx.restore();
      }

      // Inner rays
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * 2 * Math.PI) / petalCount + Math.PI / petalCount;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, innerR - 4);
        ctx.bezierCurveTo(-10 * bloom, innerR + 15 * bloom, -7 * bloom, outerR * 0.86, 0, outerR * 0.86);
        ctx.bezierCurveTo(7 * bloom, outerR * 0.86, 10 * bloom, innerR + 15 * bloom, 0, innerR - 4);
        ctx.closePath();
        ctx.fillStyle = '#fde047';
        ctx.fill();
        ctx.restore();
      }
    }

    // Central Fibonacci Disc
    const floretCount = Math.floor(240 * bloom);
    const goldenAngle = 2.39996323;
    for (let n = 1; n <= floretCount; n++) {
      const r = 2.4 * Math.sqrt(n) * (0.5 + 0.5 * bloom);
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
   * Draw Gentle Daisy with Bloom Support
   */
  public drawDaisy(cx: number, cy: number, scale = 1.0, bloom = 1.0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const effScale = scale * (0.35 + 0.65 * bloom);
    ctx.scale(effScale, effScale);

    const stemH = 160;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, stemH);
    ctx.stroke();

    const petalCount = 24;
    const outerR = 75 * bloom;
    const innerR = 24 * (0.5 + 0.5 * bloom);

    if (bloom > 0.25) {
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * 2 * Math.PI) / petalCount;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, innerR);
        ctx.bezierCurveTo(-7 * bloom, innerR + 15 * bloom, -6 * bloom, outerR - 4, 0, outerR);
        ctx.bezierCurveTo(6 * bloom, outerR - 4, 7 * bloom, innerR + 15 * bloom, 0, innerR);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#f1f5f9';
        ctx.fill();
        ctx.restore();
      }
    }

    // Yellow Stippled Core
    ctx.beginPath();
    ctx.arc(0, 0, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Tulip with Bloom Support
   */
  public drawTulip(cx: number, cy: number, scale = 1.0, color = '#fef08a', stemH = 140, bloom = 1.0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const effScale = scale * (0.4 + 0.6 * bloom);
    ctx.scale(effScale, effScale);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, stemH);
    ctx.stroke();

    const spread = 26 * (0.4 + 0.6 * bloom);
    const heightSpread = 70 * (0.5 + 0.5 * bloom);

    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.bezierCurveTo(-spread, -15, -spread * 0.8, -heightSpread + 10, 0, -heightSpread);
    ctx.bezierCurveTo(spread * 0.8, -heightSpread + 10, spread, -15, 0, 10);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-10 * bloom, 5);
    ctx.quadraticCurveTo(-15 * bloom, -30, -5 * bloom, -heightSpread + 5);
    ctx.moveTo(10 * bloom, 5);
    ctx.quadraticCurveTo(15 * bloom, -30, 5 * bloom, -heightSpread + 5);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draw Lavender Spike
   */
  public drawLavender(cx: number, cy: number, scale = 1.0, color = '#c084fc', stemH = 160, bloom = 1.0) {
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

    const whorls = Math.floor(12 * bloom);
    for (let w = 0; w < whorls; w++) {
      const wy = -w * 10;
      const spread = (8 + (12 - w) * 0.8) * bloom;

      ctx.fillStyle = w % 2 === 0 ? color : '#e879f9';
      ctx.beginPath();
      ctx.ellipse(-spread, wy, 5 * bloom, 3.5 * bloom, -Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(spread, wy, 5 * bloom, 3.5 * bloom, Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(0, wy - 2, 3.5 * bloom, 3.5 * bloom, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Draw Dense Emerald Stem & Leaf Spray at Base
   */
  public drawStemSpray(cx: number, baseY: number, width = 160, height = 150, bloom = 1.0) {
    const ctx = this.ctx;
    ctx.save();

    const stemCount = Math.floor(26 * (0.6 + 0.4 * bloom));
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

      if (i % 3 === 0 && bloom > 0.4) {
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        const midY = baseY + height * 0.4 + (i % 5) * 8;
        const midX = cx + (startX - cx) * 0.6;
        const dir = i < stemCount / 2 ? -1 : 1;
        ctx.ellipse(midX + dir * 18, midY, 20 * bloom, 4, dir * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ==========================================
  // CUTE GIFTS: PLUSHIES, CHOCOLATES & LOCKET
  // ==========================================

  /**
   * Draw Adorable Teddy Bear Plushie hugging a blooming flower with ASCII loving messages
   */
  public drawTeddyPlushie(cx: number, cy: number, scale = 1.0, isLoved = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // 1. Floating Glowing ASCII Loving Message (Stamped directly into ASCII matrix for 100% legibility)
    this.addTextOverlay({
      text: '✦ CUDDLY BARNABY BEAR FOR SREEPARNA ✦',
      canvasX: cx,
      canvasY: cy - 165 * scale,
      color: '#fde68a',
      align: 'center',
    });
    this.addTextOverlay({
      text: '♥ ISHAN LOVES YOU TO THE STARS & BEYOND ♥',
      canvasX: cx,
      canvasY: cy - 142 * scale,
      color: '#fb7185',
      align: 'center',
    });

    // Ambient Starlight & Floating Hearts
    ctx.fillStyle = '#ffffff';
    const stars = [
      { x: -140, y: -90, s: 2 },
      { x: 135, y: -80, s: 2 },
      { x: -120, y: 70, s: 1.5 },
      { x: 125, y: 60, s: 1.5 },
      { x: -90, y: -120, s: 2.5 },
      { x: 90, y: -120, s: 2.5 },
    ];
    stars.forEach((st) => {
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Bear Feet / Paws at base
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(-38, 115, 22, 16, -Math.PI / 12, 0, Math.PI * 2);
    ctx.ellipse(38, 115, 22, 16, Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();
    // Foot paw pads
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(-38, 116, 11, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(38, 116, 11, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Warm Fuzzy Bear Body
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(0, 55, 56, 64, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Belly Patch with Stitched Heart Monogram
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(0, 62, 36, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stitched Border on Belly
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.ellipse(0, 62, 34, 40, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Stitched Heart & Initials on Belly: ♥ S+I (Direct ASCII Matrix Stamp)
    this.addTextOverlay({
      text: '♥ S+I',
      canvasX: cx,
      canvasY: cy + 62 * scale,
      color: '#ef4444',
      align: 'center',
    });

    // 5. Bear Head
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(0, -18, 52, 0, Math.PI * 2);
    ctx.fill();

    // 6. Round Ears with pink inner felt & stitched edge
    // Left ear
    ctx.beginPath();
    ctx.arc(-45, -55, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-45, -55, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#fbcfe8';
    ctx.fill();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([2, 2]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Right ear
    ctx.beginPath();
    ctx.arc(45, -55, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(45, -55, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#fbcfe8';
    ctx.fill();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([2, 2]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 7. Snout / Muzzle
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(0, -6, 26, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Polished Black Button Nose with Highlight
    ctx.fillStyle = '#291307';
    ctx.beginPath();
    ctx.ellipse(0, -12, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3, -14, 2, 0, Math.PI * 2);
    ctx.fill();

    // Stitched Smile & Muzzle Seam
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 3);
    ctx.moveTo(-10, 3);
    ctx.quadraticCurveTo(0, 10, 10, 3);
    ctx.stroke();

    // 8. Glossy Button Safety Eyes with Sparkle Highlights
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(-20, -22, 7, 0, Math.PI * 2);
    ctx.arc(20, -22, 7, 0, Math.PI * 2);
    ctx.fill();
    // Double Catchlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-22, -24, 2.5, 0, Math.PI * 2);
    ctx.arc(18, -24, 2.5, 0, Math.PI * 2);
    ctx.arc(-18, -20, 1.2, 0, Math.PI * 2);
    ctx.arc(22, -20, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 9. Soft Rosy Blush Cheeks with Freckle Dots
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(-30, -7, 9, 0, Math.PI * 2);
    ctx.arc(30, -7, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(-32, -8, 1, 0, Math.PI * 2);
    ctx.arc(-28, -6, 1, 0, Math.PI * 2);
    ctx.arc(28, -6, 1, 0, Math.PI * 2);
    ctx.arc(32, -8, 1, 0, Math.PI * 2);
    ctx.fill();

    // 10. Crimson Satin Bowtie at Neck with Gold Center Knot
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(-24, 7);
    ctx.lineTo(-24, 23);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(24, 7);
    ctx.lineTo(24, 23);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 15, 6, 0, Math.PI * 2);
    ctx.fill();

    // 11. Plushie Arms & Paws Hugging Blooming Golden Sunflower
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(-52, 48, 20, 15, Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(52, 48, 20, 15, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Hugged Golden Sunflower in center
    this.drawSunflower(0, 48, 0.58, 1.0);

    if (isLoved) {
      this.addTextOverlay({
        text: '♥ HUGGED WITH LOVE ♥',
        canvasX: cx,
        canvasY: cy + 142 * scale,
        color: '#fb7185',
        align: 'center',
      });
    }

    ctx.restore();
  }

  /**
   * Draw Luxury Heart-Shaped Box of Artisan Belgian Chocolates with Ribbon & Monogram
   */
  public drawChocolateBox(cx: number, cy: number, scale = 1.0, isTasted = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // 1. Floating Glowing ASCII Loving Message (Stamped directly into ASCII matrix)
    this.addTextOverlay({
      text: '✦ BELGIAN ARTISAN TRUFFLES FOR SREEPARNA ✦',
      canvasX: cx,
      canvasY: cy - 170 * scale,
      color: '#fef08a',
      align: 'center',
    });
    this.addTextOverlay({
      text: '♥ SWEETER THAN A THOUSAND CHOCOLATES ♥',
      canvasX: cx,
      canvasY: cy - 148 * scale,
      color: '#fb7185',
      align: 'center',
    });

    // Ambient chocolate sparkle glints
    ctx.fillStyle = '#fde047';
    [
      { x: -130, y: -100 },
      { x: 130, y: -90 },
      { x: -110, y: 50 },
      { x: 115, y: 45 },
    ].forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Heart Box Shadow & Base
    ctx.fillStyle = '#4c0519';
    ctx.beginPath();
    ctx.moveTo(0, 46);
    ctx.bezierCurveTo(-125, -60, -80, -145, 0, -80);
    ctx.bezierCurveTo(80, -145, 125, -60, 0, 46);
    ctx.fill();

    // 3. Heart Box Rim (Luxurious Deep Crimson Velvet)
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(0, 36);
    ctx.bezierCurveTo(-118, -66, -74, -138, 0, -76);
    ctx.bezierCurveTo(74, -138, 118, -66, 0, 36);
    ctx.fill();

    // 4. Gold Scalloped Filigree Trim Edge
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Beaded Gold Pearls along rim
    ctx.fillStyle = '#fef08a';
    for (let t = 0; t < Math.PI * 2; t += 0.22) {
      const bx = 16 * Math.pow(Math.sin(t), 3) * 6.3;
      const by = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 5.6 - 45;
      ctx.beginPath();
      ctx.arc(bx, by, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Inner Velvet Chocolate Compartment Tray
    ctx.fillStyle = '#291307';
    ctx.beginPath();
    ctx.moveTo(0, 24);
    ctx.bezierCurveTo(-98, -55, -62, -120, 0, -68);
    ctx.bezierCurveTo(62, -120, 98, -55, 0, 24);
    ctx.fill();

    // 6. 9 Gourmet Artisan Chocolates Arranged Harmoniously
    const chocolates = [
      // Centerpiece: Ruby Chocolate Heart with Gold Leaf & S+I Monogram
      { x: 0, y: -45, r: 18, type: 'ruby_monogram', col: '#e11d48', deco: '#fef08a', text: 'S+I' },
      // Top row
      { x: -40, y: -72, r: 13, type: 'dark_gold', col: '#1c1917', deco: '#fbbf24', text: '✦' },
      { x: 40, y: -72, r: 13, type: 'white_raspberry', col: '#f8fafc', deco: '#f43f5e', text: '❀' },
      // Middle row
      { x: -52, y: -28, r: 13, type: 'hazelnut_crunch', col: '#78350f', deco: '#fde047', text: '●' },
      { x: 52, y: -28, r: 13, type: 'pistachio_matcha', col: '#166534', deco: '#ffffff', text: '◆' },
      // Center Lower
      { x: 0, y: -10, r: 14, type: 'caramel_salted', col: '#b45309', deco: '#fef3c7', text: '★' },
      // Lower row
      { x: -28, y: 10, r: 12, type: 'espresso_truffle', col: '#3e1f0e', deco: '#ca8a04', text: '✦' },
      { x: 28, y: 10, r: 12, type: 'rose_petal', col: '#fb7185', deco: '#ffffff', text: '♥' },
      // Bottom Tip praline
      { x: 0, y: 22, r: 9, type: 'gold_pearl', col: '#d97706', deco: '#fef08a', text: '•' },
    ];

    chocolates.forEach((c) => {
      // Golden fluted paper baking cup
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r + 3, 0, Math.PI * 2);
      ctx.fillStyle = '#451a03';
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Chocolate Body
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.col;
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Decorative Swirl & Monogram
      if (c.text === 'S+I') {
        this.addTextOverlay({
          text: 'S+I',
          canvasX: cx + c.x * scale,
          canvasY: cy + c.y * scale,
          color: '#fef08a',
          align: 'center',
        });
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.strokeStyle = c.deco;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(c.x - c.r * 0.5, c.y - 2);
        ctx.quadraticCurveTo(c.x, c.y - 6, c.x + c.r * 0.5, c.y - 2);
        ctx.moveTo(c.x - c.r * 0.4, c.y + 3);
        ctx.quadraticCurveTo(c.x, c.y + 6, c.x + c.r * 0.4, c.y + 3);
        ctx.stroke();
      }
    });

    // 7. Rich Red Silk Ribbon Tied in an Elaborate Corner Bow with Tails
    ctx.fillStyle = '#be123c';
    // Ribbon tails
    ctx.beginPath();
    ctx.moveTo(-60, -110);
    ctx.bezierCurveTo(-90, -80, -95, -40, -85, -20);
    ctx.lineTo(-76, -24);
    ctx.bezierCurveTo(-85, -45, -80, -80, -55, -105);
    ctx.fill();

    // Ribbon loops
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.ellipse(-65, -125, 30, 14, -Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(-25, -140, 30, 14, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Gold ribbon trim line
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-45, -132, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Center Ribbon Knot
    ctx.fillStyle = '#9f1239';
    ctx.beginPath();
    ctx.arc(-45, -132, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(-45, -132, 4, 0, Math.PI * 2);
    ctx.fill();

    if (isTasted) {
      this.addTextOverlay({
        text: '✦ TASTED • MELTING WITH SWEETNESS ✦',
        canvasX: cx,
        canvasY: cy + 68 * scale,
        color: '#fef08a',
        align: 'center',
      });
    }

    ctx.restore();
  }

  /**
   * Draw Golden Filigree Heart Locket engraved with Prominent Initials "S ♥ I" and loving message
   */
  public drawHeartLocket(cx: number, cy: number, scale = 1.0, isOpened = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // 1. Floating Glowing ASCII Loving Message (Stamped directly into ASCII matrix)
    this.addTextOverlay({
      text: '✦ HEIRLOOM GOLDEN LOCKET • S ♥ I ✦',
      canvasX: cx,
      canvasY: cy - 175 * scale,
      color: '#fef08a',
      align: 'center',
    });
    this.addTextOverlay({
      text: '♥ S ♥ I — MY HEART IS LOCKED WITH YOURS FOREVER ♥',
      canvasX: cx,
      canvasY: cy - 152 * scale,
      color: '#fb7185',
      align: 'center',
    });

    // Ambient Starlight Glints
    ctx.fillStyle = '#ffffff';
    [
      { x: -120, y: -100, s: 2 },
      { x: 120, y: -90, s: 2 },
      { x: -100, y: 40, s: 1.5 },
      { x: 105, y: 45, s: 1.5 },
      { x: 0, y: -80, s: 2.5 },
    ].forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Delicate Woven Golden Double Necklace Chain
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.2;
    ctx.setLineDash([4, 3]);
    // Outer chain drape
    ctx.beginPath();
    ctx.moveTo(-90, -170);
    ctx.quadraticCurveTo(-20, -70, 0, -42);
    ctx.moveTo(90, -170);
    ctx.quadraticCurveTo(20, -70, 0, -42);
    ctx.stroke();
    // Inner secondary chain drape
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-75, -170);
    ctx.quadraticCurveTo(-15, -60, 0, -42);
    ctx.moveTo(75, -170);
    ctx.quadraticCurveTo(15, -60, 0, -42);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Ornate Locket Bail Loop (Connector to necklace)
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.ellipse(0, -44, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Diamond sparkle on bail
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -44, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Solid Gold Heart Locket Case (High-contrast burnished gold)
    // Outer Drop Shadow for 3D depth
    ctx.fillStyle = '#713f12';
    ctx.beginPath();
    ctx.moveTo(0, 76);
    ctx.bezierCurveTo(-110, -15, -72, -88, 0, -32);
    ctx.bezierCurveTo(72, -88, 110, -15, 0, 76);
    ctx.fill();

    // Main Polished 24k Gold Heart Body
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(0, 70);
    ctx.bezierCurveTo(-105, -20, -68, -84, 0, -36);
    ctx.bezierCurveTo(68, -84, 105, -20, 0, 70);
    ctx.fill();

    // 5. Beaded Filigree Perimeter (Golden Pearls around heart)
    ctx.fillStyle = '#fef08a';
    for (let t = 0; t < Math.PI * 2; t += 0.2) {
      const hx = 16 * Math.pow(Math.sin(t), 3) * 5.6;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 4.9 - 7;
      ctx.beginPath();
      ctx.arc(hx, hy, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Raised Inner Filigree Border with Victorian Scrollwork
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, 58);
    ctx.bezierCurveTo(-86, -15, -54, -68, 0, -28);
    ctx.bezierCurveTo(54, -68, 86, -15, 0, 58);
    ctx.stroke();

    // 7. Central Heart Medallion (Royal Velvet Inset)
    ctx.fillStyle = '#831843'; // Deep romantic ruby
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.bezierCurveTo(-72, -10, -45, -56, 0, -22);
    ctx.bezierCurveTo(45, -56, 72, -10, 0, 50);
    ctx.fill();

    // Gold inner border for medallion
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 8. PROMINENT ENGRAVED INITIALS: S ♥ I (Direct ASCII Matrix Stamp)
    if (!isOpened) {
      this.addTextOverlay({
        text: 'S ♥ I',
        canvasX: cx,
        canvasY: cy - 1 * scale,
        color: '#fef08a',
        align: 'center',
      });
      this.addTextOverlay({
        text: 'SREEPARNA ♥ ISHAN',
        canvasX: cx,
        canvasY: cy + 24 * scale,
        color: '#fef08a',
        align: 'center',
      });
      this.addTextOverlay({
        text: 'EST. FOREVER',
        canvasX: cx,
        canvasY: cy + 36 * scale,
        color: '#fcd34d',
        align: 'center',
      });
    } else {
      this.addTextOverlay({
        text: 'SREEPARNA ♥ ISHAN',
        canvasX: cx,
        canvasY: cy + 18 * scale,
        color: '#fef08a',
        align: 'center',
      });
      this.addTextOverlay({
        text: 'EST. FOREVER',
        canvasX: cx,
        canvasY: cy + 32 * scale,
        color: '#fcd34d',
        align: 'center',
      });
      this.addTextOverlay({
        text: '✨ LOCKET OPENED • TWO SOULS AS ONE ✨',
        canvasX: cx,
        canvasY: cy + 96 * scale,
        color: '#fef08a',
        align: 'center',
      });
    }

    ctx.restore();
  }

  /**
   * Draw Authentic Realistic Love Letter Envelope & Glowing Unfolded Stationery
   * With glowing typography matching the bouquet page!
   * @param cx Center X on canvas (e.g. 260)
   * @param cy Center Y on canvas (e.g. 340)
   * @param scale Scale factor (e.g. 1.0)
   * @param openProgress 0.0 (sealed envelope) to 1.0 (fully unfolded parchment letter)
   * @param letter The LoveNote containing title, badge, message, ps
   */
  public drawLoveLetter(
    cx: number,
    cy: number,
    scale: number,
    openProgress: number,
    letter: { title: string; badge: string; message: string; ps: string }
  ) {
    const ctx = this.ctx;
    ctx.save();

    if (openProgress < 0.6) {
      // -------------------------------------------------------------
      // 1. CLOSED OR UNSEALING REALISTIC AIRMAIL ENVELOPE
      // -------------------------------------------------------------
      const ew = 380 * scale;
      const eh = 240 * scale;
      const ey = cy + 20 * scale;

      // Soft envelope drop shadow
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(cx - ew / 2 - 4, ey - eh / 2 + 6, ew + 8, eh + 8);

      // Envelope body parchment
      ctx.fillStyle = '#292524';
      ctx.fillRect(cx - ew / 2, ey - eh / 2, ew, eh);

      // Airmail perimeter border (Classic alternating red & cyan chevron slashes)
      ctx.save();
      const chevronW = 10 * scale;
      ctx.lineWidth = 4;
      for (let x = cx - ew / 2; x < cx + ew / 2; x += chevronW * 2) {
        ctx.strokeStyle = '#38bdf8'; // Sky blue airmail
        ctx.beginPath();
        ctx.moveTo(x, ey - eh / 2 + 2);
        ctx.lineTo(x + chevronW, ey - eh / 2 + 6);
        ctx.moveTo(x, ey + eh / 2 - 2);
        ctx.lineTo(x + chevronW, ey + eh / 2 - 6);
        ctx.stroke();

        ctx.strokeStyle = '#f43f5e'; // Crimson airmail
        ctx.beginPath();
        ctx.moveTo(x + chevronW, ey - eh / 2 + 2);
        ctx.lineTo(x + chevronW * 2, ey - eh / 2 + 6);
        ctx.moveTo(x + chevronW, ey + eh / 2 - 2);
        ctx.lineTo(x + chevronW * 2, ey + eh / 2 - 6);
        ctx.stroke();
      }
      ctx.restore();

      // Delicate inner border line
      ctx.strokeStyle = '#57534e';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - ew / 2 + 8, ey - eh / 2 + 8, ew - 16, eh - 16);

      // Diagonal envelope fold lines meeting at center
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // From bottom corners to center
      ctx.moveTo(cx - ew / 2 + 8, ey + eh / 2 - 8);
      ctx.lineTo(cx, ey);
      ctx.moveTo(cx + ew / 2 - 8, ey + eh / 2 - 8);
      ctx.lineTo(cx, ey);
      ctx.stroke();

      // Top triangular flap
      ctx.beginPath();
      ctx.moveTo(cx - ew / 2 + 8, ey - eh / 2 + 8);
      if (openProgress <= 0.2) {
        // Closed flap pointing to center
        ctx.lineTo(cx, ey + 15);
      } else {
        // Flap opening upward
        const flapLift = (openProgress - 0.2) / 0.4;
        const flapTipY = (ey + 15) - flapLift * 150;
        ctx.lineTo(cx, flapTipY);
      }
      ctx.lineTo(cx + ew / 2 - 8, ey - eh / 2 + 8);
      ctx.fillStyle = '#1c1917';
      ctx.fill();
      ctx.strokeStyle = '#78716c';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Postage Stamp in Upper Right
      const stampX = cx + ew / 2 - 62 * scale;
      const stampY = ey - eh / 2 + 20 * scale;
      const stampW = 48 * scale;
      const stampH = 56 * scale;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(stampX, stampY, stampW, stampH);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(stampX, stampY, stampW, stampH);
      // Mini flower in postage stamp
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(stampX + stampW / 2, stampY + stampH / 2, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(stampX + stampW / 2, stampY + stampH / 2, 3 * scale, 0, Math.PI * 2);
      ctx.fill();
      // Wavy cancellation lines across the stamp
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const lineY = stampY + 12 + i * 14;
        ctx.moveTo(stampX - 25, lineY);
        ctx.quadraticCurveTo(stampX + stampW / 2, lineY - 6, stampX + stampW + 12, lineY);
      }
      ctx.stroke();

      // Airmail Circular Rubber Stamp in Upper Left
      const postX = cx - ew / 2 + 55 * scale;
      const postY = ey - eh / 2 + 45 * scale;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(postX, postY, 26 * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(postX, postY, 20 * scale, 0, Math.PI * 2);
      ctx.stroke();

      // Center Wax Seal (if not fully broken)
      if (openProgress <= 0.35) {
        const sealY = ey + 15;
        // Ribbon tails below seal
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.moveTo(cx - 10, sealY + 15);
        ctx.lineTo(cx - 16, sealY + 45);
        ctx.lineTo(cx - 8, sealY + 40);
        ctx.lineTo(cx - 2, sealY + 46);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx + 10, sealY + 15);
        ctx.lineTo(cx + 16, sealY + 45);
        ctx.lineTo(cx + 8, sealY + 40);
        ctx.lineTo(cx + 2, sealY + 46);
        ctx.closePath();
        ctx.fill();

        // Crimson Wax Medallion
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(cx, sealY, 22 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Glowing ASCII Typography Stamped on Envelope
      this.addTextOverlay({
        text: '✦ AIR MAIL • SPECIAL COURIER OF LOVE ✦',
        canvasX: cx,
        canvasY: ey - eh / 2 + 35 * scale,
        color: '#38bdf8',
        align: 'center',
      });
      this.addTextOverlay({
        text: 'DELIVER TO: SREEPARNA (MY PRETTIEST BLOSSOM 🌸)',
        canvasX: cx,
        canvasY: ey + eh / 2 - 58 * scale,
        color: '#f472b6',
        align: 'center',
      });
      this.addTextOverlay({
        text: 'FROM: ISHAN (WITH ENDLESS MEADOW FLOWERS 🌻)',
        canvasX: cx,
        canvasY: ey + eh / 2 - 38 * scale,
        color: '#fbbf24',
        align: 'center',
      });
      this.addTextOverlay({
        text: openProgress <= 0.2 ? '♥ WAX SEAL: S + I ♥' : '✦ WAX SEAL UNSEALED! ✦',
        canvasX: cx,
        canvasY: ey + eh / 2 - 18 * scale,
        color: '#facc15',
        align: 'center',
      });
    } else {
      // -------------------------------------------------------------
      // 2. FULLY UNFOLDED AUTHENTIC LOVE LETTER PARCHMENT
      // -------------------------------------------------------------
      const pw = 460 * scale;
      const ph = 600 * scale;

      // Drop shadow behind parchment
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(cx - pw / 2 - 3, cy - ph / 2 + 5, pw + 6, ph + 6);

      // Main parchment paper body (Deep obsidian-slate parchment)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - pw / 2, cy - ph / 2, pw, ph);

      // Outer delicate starlight border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - pw / 2 + 8, cy - ph / 2 + 8, pw - 16, ph - 16);

      // Inner golden border
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - pw / 2 + 14, cy - ph / 2 + 14, pw - 28, ph - 28);

      // Subtle botanical watermark drawn in center background with faint opacity
      ctx.save();
      ctx.globalAlpha = 0.12;
      this.drawDaisy(cx, cy + 30, 1.3, 1.0);
      ctx.restore();

      // Corner botanical flourishes on all 4 corners
      const corners = [
        { x: cx - pw / 2 + 24, y: cy - ph / 2 + 24 },
        { x: cx + pw / 2 - 24, y: cy - ph / 2 + 24 },
        { x: cx - pw / 2 + 24, y: cy + ph / 2 - 24 },
        { x: cx + pw / 2 - 24, y: cy + ph / 2 - 24 },
      ];
      ctx.fillStyle = '#facc15';
      for (const c of corners) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // ============================================================
      // GLOWING ROMANTIC ASCII TYPOGRAPHY (MATCHING BOUQUET PAGE!)
      // ============================================================
      const topY = cy - ph / 2 + 36;

      // Letter Header & Badge
      this.addTextOverlay({
        text: `✦ ${letter.badge.toUpperCase()} ✦`,
        canvasX: cx,
        canvasY: topY,
        color: '#facc15',
        align: 'center',
      });
      this.addTextOverlay({
        text: `♥ ${letter.title.toUpperCase()} ♥`,
        canvasX: cx,
        canvasY: topY + 22,
        color: '#ffffff',
        align: 'center',
      });
      this.addTextOverlay({
        text: '❀ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ❀',
        canvasX: cx,
        canvasY: topY + 44,
        color: '#f472b6',
        align: 'center',
      });

      // Salutation
      this.addTextOverlay({
        text: 'DEAR SREEPARNA,',
        canvasX: cx - 180,
        canvasY: topY + 74,
        color: '#fef08a',
        align: 'left',
      });

      // Wrap and render letter message paragraphs neatly
      const wrappedLines = this.wrapLetterText(letter.message, 44);
      let lineY = topY + 100;
      for (const line of wrappedLines) {
        if (line.trim().length > 0) {
          this.addTextOverlay({
            text: line,
            canvasX: cx - 180,
            canvasY: lineY,
            color: '#f8fafc',
            align: 'left',
          });
        }
        lineY += 21;
      }

      // Valediction & Signature
      lineY += 10;
      this.addTextOverlay({
        text: 'With infinite love, hugs, & endless flowers,',
        canvasX: cx - 180,
        canvasY: lineY,
        color: '#f472b6',
        align: 'left',
      });
      lineY += 22;
      this.addTextOverlay({
        text: 'Ishan  ♥',
        canvasX: cx - 180,
        canvasY: lineY,
        color: '#fbbf24',
        align: 'left',
      });

      // Postscript (P.S.) Section
      if (letter.ps) {
        lineY += 24;
        this.addTextOverlay({
          text: '....................................................',
          canvasX: cx,
          canvasY: lineY,
          color: '#475569',
          align: 'center',
        });
        lineY += 18;
        const psLines = this.wrapLetterText(letter.ps, 44);
        for (const pline of psLines) {
          this.addTextOverlay({
            text: pline,
            canvasX: cx - 180,
            canvasY: lineY,
            color: '#cbd5e1',
            align: 'left',
          });
          lineY += 20;
        }
      }

      // Bottom Watermark Wax Stamp
      this.addTextOverlay({
        text: '★ SREEPARNA ♥ ISHAN • LOCKED WITH LOVE FOREVER ★',
        canvasX: cx,
        canvasY: cy + ph / 2 - 30,
        color: '#facc15',
        align: 'center',
      });
    }

    ctx.restore();
  }

  // Text wrapper utility for love letters
  private wrapLetterText(text: string, maxChars = 44): string[] {
    const paragraphs = text.split('\n');
    const result: string[] = [];

    for (const para of paragraphs) {
      if (para.trim().length === 0) {
        result.push('');
        continue;
      }
      const words = para.split(' ');
      let currentLine = '';

      for (const word of words) {
        if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxChars) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) result.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) result.push(currentLine);
    }

    return result;
  }


  /**
   * The Master Bouquet Composition:
   * Accurately reproduces the multi-layered lilies, sunflowers, daisies, tulips,
   * emerald stems, with smooth bloom progression and floating romantic typography!
   */
  public drawReferenceBouquet(comp: BouquetComposition) {
    const ctx = this.ctx;
    this.clear();

    const bloom = comp.bloomProgress !== undefined ? comp.bloomProgress : 1.0;
    const cx = this.canvas.width / 2;
    const cy = 270;

    ctx.save();

    // 1. Floating Animated Romantic Typography (e.g. "I LOVE YOU SREEPARNA")
    const msg = comp.floatingMessage || 'I LOVE YOU SREEPARNA';
    if (msg.trim().length > 0) {
      this.addTextOverlay({
        text: `✦ ${msg.toUpperCase()} ✦`,
        canvasX: cx,
        canvasY: 48,
        color: '#ffffff',
        align: 'center',
      });
      this.addTextOverlay({
        text: '♥ Forever Blooming in Starlight ♥',
        canvasX: cx,
        canvasY: 76,
        color: '#94a3b8',
        align: 'center',
      });
    }

    // 2. Background Stardust Particle Spray
    ctx.fillStyle = '#ffffff';
    const starCount = Math.floor(60 * bloom);
    for (let i = 0; i < starCount; i++) {
      const px = cx + (Math.random() - 0.5) * 360;
      const py = cy + (Math.random() - 0.5) * 440;
      ctx.fillRect(px, py, 1.4, 1.4);
    }

    // 3. Tall Background Buds & Upright Stalks (Top layer)
    this.drawLavender(cx - 30, cy - 145, 0.9, '#a855f7', 180, bloom);
    this.drawLavender(cx + 35, cy - 140, 0.9, '#c084fc', 180, bloom);
    this.drawTulip(cx - 70, cy - 110, 0.85, '#e2e8f0', 160, bloom);
    this.drawTulip(cx + 85, cy - 105, 0.85, '#fde047', 160, bloom);

    // 4. High Center: Deep Crimson / Ruby Stargazer Lily
    this.drawLily(
      cx,
      cy - 80,
      0.98,
      0,
      '#e11d48',
      '#9f1239',
      '#facc15',
      true,
      bloom
    );

    // 5. Flanking Side Blooms:
    this.drawLily(
      cx - 100,
      cy - 20,
      0.68,
      -0.25,
      '#eab308',
      '#a16207',
      '#ca8a04',
      false,
      bloom
    );

    this.drawLily(
      cx + 105,
      cy - 25,
      0.65,
      0.25,
      '#c026d3',
      '#86198f',
      '#facc15',
      false,
      bloom
    );

    this.drawLily(
      cx - 115,
      cy + 105,
      0.58,
      -0.4,
      '#facc15',
      '#ca8a04',
      '#713f12',
      false,
      bloom
    );

    this.drawLily(
      cx + 115,
      cy + 120,
      0.55,
      0.35,
      '#dc2626',
      '#991b1b',
      '#fef08a',
      false,
      bloom
    );

    // 6. Focal Mid Row:
    this.drawLily(
      cx - 55,
      cy + 30,
      1.05,
      -0.12,
      '#db2777',
      '#9d174d',
      '#fef08a',
      true,
      bloom
    );

    this.drawLily(
      cx + 55,
      cy + 40,
      1.05,
      0.15,
      '#f8fafc',
      '#cbd5e1',
      '#facc15',
      true,
      bloom
    );

    // 7. Lower Centerpiece: Warm Amber Golden Sunflower
    if (comp.sunflower > 0) {
      this.drawSunflower(cx, cy + 115, 0.95, bloom);
    } else {
      this.drawLily(
        cx,
        cy + 115,
        0.98,
        0.05,
        '#d97706',
        '#78350f',
        '#fef08a',
        true,
        bloom
      );
    }

    // 8. Base Layer: Rich Emerald Stem & Leaf Spray
    this.drawStemSpray(cx, cy + 180, 170, 160, bloom);

    ctx.restore();
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}

function parseHexColor(colorStr?: string): { r: number; g: number; b: number } {
  if (!colorStr) return { r: 255, g: 255, b: 255 };
  if (colorStr.startsWith('#')) {
    const hex = colorStr.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length >= 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }
  return { r: 255, g: 255, b: 255 };
}

/**
 * High-Density Rasterizer: Converts the high-resolution vector canvas into fine-pixel ASCII
 * and stamps crystal-clear, legible typography overlays directly into the character matrix
 */
export function rasterizeBouquet(
  sourceCanvas: HTMLCanvasElement,
  options: RenderOptions,
  overlays?: AsciiTextOverlay[]
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

  for (let y = 0; y < height; y++) {
    const row: AsciiCell[] = [];

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

      row.push({ char, r, g, b, a, brightness });
    }

    grid.push(row);
  }

  // Stamp Text Overlays directly into character matrix for 100% crisp legibility
  const stampedOverlays: StampedOverlay[] = [];

  if (overlays && overlays.length > 0) {
    for (const overlay of overlays) {
      if (!overlay.text) continue;

      const gridY = Math.max(
        0,
        Math.min(height - 1, Math.round((overlay.canvasY / sourceCanvas.height) * height))
      );
      const gridX = Math.max(
        0,
        Math.min(width - 1, Math.round((overlay.canvasX / sourceCanvas.width) * width))
      );

      const align = overlay.align || 'center';
      const textLen = overlay.text.length;
      let startX = gridX;
      if (align === 'center') {
        startX = Math.round(gridX - textLen / 2);
      } else if (align === 'right') {
        startX = gridX - textLen;
      }

      // Palette styling for text
      let { r, g, b } = parseHexColor(overlay.color);
      if (paletteMode === 'monochrome') {
        r = 255;
        g = 255;
        b = 255;
      } else if (paletteMode === 'emerald') {
        if (overlay.color?.includes('fde68a') || overlay.color?.includes('fef08a') || overlay.color?.includes('ffffff')) {
          r = 255;
          g = 245;
          b = 160;
        } else {
          r = 52;
          g = 211;
          b = 153;
        }
      } else if (paletteMode === 'amber') {
        r = 254;
        g = 240;
        b = 138;
      } else if (paletteMode === 'amethyst') {
        r = 233;
        g = 213;
        b = 255;
      }

      const isTitle = overlay.text.includes('✦') || (overlay.text === overlay.text.toUpperCase() && overlay.text.length > 10 && !overlay.text.includes('♥'));
      const isSubtitle = overlay.text.includes('♥') && !isTitle;

      // Clear adjacent padding spaces so no scanlines clip through the text
      if (startX - 1 >= 0 && startX - 1 < width && grid[gridY]) {
        grid[gridY][startX - 1] = { char: ' ', r: 0, g: 0, b: 0, a: 0, brightness: 0 };
      }
      if (startX + textLen >= 0 && startX + textLen < width && grid[gridY]) {
        grid[gridY][startX + textLen] = { char: ' ', r: 0, g: 0, b: 0, a: 0, brightness: 0 };
      }

      for (let i = 0; i < textLen; i++) {
        const x = startX + i;
        if (x >= 0 && x < width && grid[gridY]) {
          grid[gridY][x] = {
            char: overlay.text[i],
            r,
            g,
            b,
            a: 1.0,
            brightness: 1.0,
            isOverlay: true,
          };
        }
      }

      stampedOverlays.push({
        text: overlay.text,
        gridX,
        gridY,
        align,
        colorStr: `rgb(${r}, ${g}, ${b})`,
        isTitle,
        isSubtitle,
      });
    }
  }

  const textLines = grid.map((row) => row.map((cell) => cell.char).join(''));

  return {
    grid,
    plainText: textLines.join('\n'),
    width,
    height,
    stampedOverlays,
  };
}
