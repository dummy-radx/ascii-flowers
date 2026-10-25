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
}

export interface AsciiGridResult {
  grid: AsciiCell[][];
  plainText: string;
  width: number;
  height: number;
}

/**
 * Botanical Vector Renderer: Accurately paints flowers, bouquets, plushies, chocolates,
 * and glowing romantic ASCII banners
 */
export class BotanicalCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

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
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
   * Draw Adorable Teddy Bear Plushie hugging a blooming flower
   */
  public drawTeddyPlushie(cx: number, cy: number, scale = 1.0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Warm fuzzy bear body
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(0, 60, 52, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly patch
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(0, 65, 34, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stitched Heart on Belly
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 20px serif';
    ctx.textAlign = 'center';
    ctx.fillText('♥ S+I', 0, 72);

    // Bear Head
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(0, -10, 48, 0, Math.PI * 2);
    ctx.fill();

    // Round Ears with pink inner felt
    // Left ear
    ctx.beginPath();
    ctx.arc(-42, -45, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-42, -45, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#fbcfe8';
    ctx.fill();

    // Right ear
    ctx.beginPath();
    ctx.arc(42, -45, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(42, -45, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#fbcfe8';
    ctx.fill();

    // Snout / Muzzle
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(0, 2, 24, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose & Smile
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(0, -3, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(0, 10);
    ctx.moveTo(-8, 10);
    ctx.quadraticCurveTo(0, 15, 8, 10);
    ctx.stroke();

    // Glossy Button Eyes with sparkles
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(-18, -15, 6, 0, Math.PI * 2);
    ctx.arc(18, -15, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-20, -17, 2, 0, Math.PI * 2);
    ctx.arc(16, -17, 2, 0, Math.PI * 2);
    ctx.fill();

    // Blush Cheeks
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(-28, -2, 8, 0, Math.PI * 2);
    ctx.arc(28, -2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Plushie Paws hugging a glowing sunflower
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(-48, 55, 18, 14, Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(48, 55, 18, 14, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Hugged Sunflower
    this.drawSunflower(0, 50, 0.55, 1.0);

    ctx.restore();
  }

  /**
   * Draw Luxury Heart-Shaped Box of Chocolates & Pralines with Ribbon
   */
  public drawChocolateBox(cx: number, cy: number, scale = 1.0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Heart Box Outer Rim (Rich Velvet Red & Gold Trim)
    ctx.save();
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.bezierCurveTo(-110, -70, -70, -140, 0, -80);
    ctx.bezierCurveTo(70, -140, 110, -70, 0, 30);
    ctx.fill();

    // Gold filigree edge
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner Chocolate Tray
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.bezierCurveTo(-95, -60, -60, -125, 0, -75);
    ctx.bezierCurveTo(60, -125, 95, -60, 0, 20);
    ctx.fill();
    ctx.restore();

    // Assorted Artisan Chocolates inside
    const chocolates = [
      { x: -35, y: -70, type: 'dark_truffle', col: '#291307', deco: '#f59e0b' },
      { x: 35, y: -70, type: 'white_pearl', col: '#f8fafc', deco: '#ec4899' },
      { x: 0, y: -50, type: 'heart_ruby', col: '#dc2626', deco: '#ffffff' },
      { x: -45, y: -30, type: 'hazelnut', col: '#78350f', deco: '#fde047' },
      { x: 45, y: -30, type: 'pistachio', col: '#15803d', deco: '#ffffff' },
      { x: 0, y: -15, type: 'caramel_gold', col: '#d97706', deco: '#fef08a' },
      { x: 0, y: 10, type: 'mini_rose', col: '#f43f5e', deco: '#ffffff' },
    ];

    chocolates.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = c.col;
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Drizzle / Glaze decoration
      ctx.strokeStyle = c.deco;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(c.x - 8, c.y - 4);
      ctx.quadraticCurveTo(c.x, c.y - 8, c.x + 8, c.y - 4);
      ctx.moveTo(c.x - 6, c.y + 4);
      ctx.quadraticCurveTo(c.x, c.y + 8, c.x + 6, c.y + 4);
      ctx.stroke();
    });

    // Satin Ribbon Bow over the top corner
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.ellipse(-50, -100, 26, 12, -Math.PI / 6, 0, Math.PI * 2);
    ctx.ellipse(-15, -115, 26, 12, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.arc(-32, -108, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Golden Filigree Heart Locket engraved with S+I
   */
  public drawHeartLocket(cx: number, cy: number, scale = 1.0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Delicate Necklace Chain in ASCII dots
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(-80, -160);
    ctx.quadraticCurveTo(0, -60, 0, -30);
    ctx.moveTo(80, -160);
    ctx.quadraticCurveTo(0, -60, 0, -30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Golden Heart Locket Case
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(0, 70);
    ctx.bezierCurveTo(-100, -20, -65, -80, 0, -30);
    ctx.bezierCurveTo(65, -80, 100, -20, 0, 70);
    ctx.fill();

    // Inner embossed filigree border
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 56);
    ctx.bezierCurveTo(-82, -15, -52, -65, 0, -25);
    ctx.bezierCurveTo(52, -65, 82, -15, 0, 56);
    ctx.stroke();

    // Engraved Monogram: SREEPARNA ♥ ISHAN
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SREEPARNA', 0, 0);
    ctx.fillStyle = '#dc2626';
    ctx.fillText('♥', 0, 16);
    ctx.fillStyle = '#78350f';
    ctx.fillText('ISHAN', 0, 32);

    // Starlight reflections
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-35, -35, 3.5, 0, Math.PI * 2);
    ctx.arc(38, -10, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
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
      ctx.save();
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';

      // Soft starlight glow for text
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`✦ ${msg.toUpperCase()} ✦`, cx, 48);

      // Sub-caption
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('♥ Forever Blooming in Starlight ♥', cx, 70);
      ctx.restore();
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
