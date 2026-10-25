// PixiJS Hardware-Accelerated Vector Botanical Engine & AsciiFilter Integration
// Provides 60fps WebGL vector flower drawing, smooth blooming physics, swaying stems, and Pixi AsciiFilter

import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { AsciiFilter } from 'pixi-filters';

export type PixiPalette = 'reference' | 'emerald' | 'monochrome' | 'amber';

export interface PixiBouquetConfig {
  sunflower: number;
  daisy: number;
  lily: number;
  tulip: number;
  lavender: number;
  bloom: number; // 0.05 to 1.0
  sway: boolean;
  asciiSize: number; // 4 to 16
  palette: PixiPalette;
  floatingMessage: string;
}

export class PixiBotanicalEngine {
  public app: Application;
  public mainContainer: Container;
  public bouquetContainer: Container;
  public particlesContainer: Container;
  public textContainer: Container;
  public asciiFilter: AsciiFilter;

  private isInitialized = false;
  private time = 0;
  private particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = [];

  constructor() {
    this.app = new Application();
    this.mainContainer = new Container();
    this.bouquetContainer = new Container();
    this.particlesContainer = new Container();
    this.textContainer = new Container();

    // Default AsciiFilter with size 6
    this.asciiFilter = new AsciiFilter({
      size: 6,
      replaceColor: false,
    });
  }

  public async init(canvas: HTMLCanvasElement, width = 640, height = 720) {
    if (this.isInitialized) return;

    await this.app.init({
      canvas,
      width,
      height,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 2,
      autoDensity: true,
      powerPreference: 'high-performance',
    });

    this.mainContainer.addChild(this.particlesContainer);
    this.mainContainer.addChild(this.bouquetContainer);

    // Apply PixiJS AsciiFilter to flowers and particles only
    this.mainContainer.filters = [this.asciiFilter];
    this.app.stage.addChild(this.mainContainer);

    // Mount textContainer directly on app.stage ABOVE the filter for razor-sharp typography
    this.app.stage.addChild(this.textContainer);

    // Init stardust particles
    for (let i = 0; i < 65; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.6,
        alpha: 0.3 + Math.random() * 0.7,
        size: 1.5 + Math.random() * 2,
      });
    }

    // Animation Ticker
    this.app.ticker.add((ticker: any) => {
      this.time += ticker.deltaTime;
      this.updateParticles(width, height);
    });

    this.isInitialized = true;
  }

  public updateParticles(w: number, h: number) {
    this.particlesContainer.removeChildren();
    const g = new Graphics();

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = h;
        p.x = Math.random() * w;
      }

      g.circle(p.x, p.y, p.size);
      g.fill({ color: 0xffffff, alpha: p.alpha * (0.8 + 0.2 * Math.sin(this.time * 0.05 + p.x)) });
    }

    this.particlesContainer.addChild(g);
  }

  public setFilterOptions(size: number, palette: PixiPalette, enableFilter = true) {
    if (!enableFilter) {
      this.mainContainer.filters = [];
      return;
    }

    this.asciiFilter.size = size;

    if (palette === 'monochrome') {
      this.asciiFilter.color = 0xffffff;
      this.asciiFilter.replaceColor = true;
    } else if (palette === 'emerald') {
      this.asciiFilter.color = 0x34d399;
      this.asciiFilter.replaceColor = true;
    } else if (palette === 'amber') {
      this.asciiFilter.color = 0xfbbf24;
      this.asciiFilter.replaceColor = true;
    } else {
      // Reference vivid original colors!
      this.asciiFilter.replaceColor = false;
    }

    this.mainContainer.filters = [this.asciiFilter];
  }

  /**
   * Render Master Bouquet matching reference image with vector precision and bloom physics
   */
  public renderBouquet(config: PixiBouquetConfig) {
    this.bouquetContainer.removeChildren();
    this.textContainer.removeChildren();

    const cx = this.app.screen.width / 2;
    const cy = this.app.screen.height * 0.44;
    const bloom = config.bloom;

    // Organic wind sway angle
    const swayAngle = config.sway ? Math.sin(this.time * 0.02) * 0.025 : 0;
    this.bouquetContainer.rotation = swayAngle;
    this.bouquetContainer.pivot.set(cx, this.app.screen.height);
    this.bouquetContainer.position.set(cx, this.app.screen.height);

    // 1. Floating Romantic Typography Banner
    if (config.floatingMessage && config.floatingMessage.trim().length > 0) {
      const titleStyle = new TextStyle({
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 22,
        fontWeight: 'bold',
        fill: 0xffffff,
        letterSpacing: 2,
        align: 'center',
      });
      const subStyle = new TextStyle({
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 12,
        fill: 0x94a3b8,
        letterSpacing: 1,
        align: 'center',
      });

      const title = new Text({ text: `✦ ${config.floatingMessage.toUpperCase()} ✦`, style: titleStyle });
      title.anchor.set(0.5);
      title.position.set(cx, 48);

      const subtitle = new Text({ text: '♥ Forever Blooming in Starlight ♥', style: subStyle });
      subtitle.anchor.set(0.5);
      subtitle.position.set(cx, 74);

      this.textContainer.addChild(title);
      this.textContainer.addChild(subtitle);
    }

    // 2. Base Emerald Stem Spray (Vector Curves)
    const stemsG = new Graphics();
    this.drawVectorStems(stemsG, cx, cy + 180, 180, 170, bloom);
    this.bouquetContainer.addChild(stemsG);

    // 3. Background Upright Lavender & Tulip Buds
    const topBudsG = new Graphics();
    this.drawVectorLavender(topBudsG, cx - 35, cy - 145, 0.9, 0xa855f7, 180, bloom);
    this.drawVectorLavender(topBudsG, cx + 40, cy - 140, 0.9, 0xc084fc, 180, bloom);
    this.drawVectorTulip(topBudsG, cx - 75, cy - 110, 0.85, 0xe2e8f0, 160, bloom);
    this.drawVectorTulip(topBudsG, cx + 90, cy - 105, 0.85, 0xfde047, 160, bloom);
    this.bouquetContainer.addChild(topBudsG);

    // 4. High Center: Deep Crimson / Ruby Stargazer Lily
    const rubyLilyG = new Graphics();
    this.drawVectorLily(rubyLilyG, cx, cy - 80, 0.98, 0, 0xe11d48, 0x9f1239, 0xfacc15, true, bloom);
    this.bouquetContainer.addChild(rubyLilyG);

    // 5. Flanking Side Blooms:
    const flanksG = new Graphics();
    this.drawVectorLily(flanksG, cx - 105, cy - 20, 0.68, -0.25, 0xeab308, 0xa16207, 0xca8a04, false, bloom);
    this.drawVectorLily(flanksG, cx + 110, cy - 25, 0.65, 0.25, 0xc026d3, 0x86198f, 0xfacc15, false, bloom);
    this.drawVectorLily(flanksG, cx - 120, cy + 105, 0.58, -0.4, 0xfacc15, 0xca8a04, 0x713f12, false, bloom);
    this.drawVectorLily(flanksG, cx + 120, cy + 120, 0.55, 0.35, 0xdc2626, 0x991b1b, 0xfef08a, false, bloom);
    this.bouquetContainer.addChild(flanksG);

    // 6. Focal Mid Row:
    // Left: Vivid Magenta Stargazer Lily
    const magentaLilyG = new Graphics();
    this.drawVectorLily(magentaLilyG, cx - 55, cy + 30, 1.05, -0.12, 0xdb2777, 0x9d174d, 0xfef08a, true, bloom);
    this.bouquetContainer.addChild(magentaLilyG);

    // Right: Luminous Pearlescent White Stargazer Lily
    const whiteLilyG = new Graphics();
    this.drawVectorLily(whiteLilyG, cx + 55, cy + 40, 1.05, 0.15, 0xf8fafc, 0xcbd5e1, 0xfacc15, true, bloom);
    this.bouquetContainer.addChild(whiteLilyG);

    // 7. Lower Centerpiece: Warm Amber Sunflower (or golden bloom)
    const focalCenterG = new Graphics();
    if (config.sunflower > 0) {
      this.drawVectorSunflower(focalCenterG, cx, cy + 115, 0.95, bloom);
    } else {
      this.drawVectorLily(focalCenterG, cx, cy + 115, 0.98, 0.05, 0xd97706, 0x78350f, 0xfef08a, true, bloom);
    }
    this.bouquetContainer.addChild(focalCenterG);
  }

  // ==========================================
  // VECTOR BOTANICAL DRAWING (Bézier Curves)
  // ==========================================

  public drawVectorLily(
    g: Graphics,
    cx: number,
    cy: number,
    scale: number,
    rot: number,
    petalColor: number,
    ribColor: number,
    throatColor: number,
    showStamens = true,
    bloom = 1.0
  ) {
    const effScale = scale * (0.35 + 0.65 * bloom);

    const tepalAngles = [
      -Math.PI / 2,
      -Math.PI / 2 + (Math.PI * 2) / 6,
      -Math.PI / 2 + (Math.PI * 4) / 6,
      Math.PI / 2,
      Math.PI / 2 + (Math.PI * 2) / 6,
      Math.PI / 2 + (Math.PI * 4) / 6,
    ];

    tepalAngles.forEach((angle, idx) => {
      const isInner = idx % 2 === 0;
      const maxLen = (isInner ? 92 : 82) * effScale;
      const maxW = (isInner ? 36 : 28) * effScale;
      const len = maxLen * (0.3 + 0.7 * bloom);
      const w = maxW * (0.2 + 0.8 * bloom);

      const totalAngle = angle + rot;
      const cos = Math.cos(totalAngle);
      const sin = Math.sin(totalAngle);

      // Local to global rotation helper
      const pt = (x: number, y: number) => ({
        x: cx + (x * cos - y * sin),
        y: cy + (x * sin + y * cos),
      });

      const p0 = pt(0, 8 * effScale);
      const cp1 = pt(-w, (20 + 10 * bloom) * effScale);
      const cp2 = pt(-w * 0.8, len * 0.72);
      const tip = pt(0, len);
      const cp3 = pt(w * 0.8, len * 0.72);
      const cp4 = pt(w, (20 + 10 * bloom) * effScale);

      g.beginPath();
      g.moveTo(p0.x, p0.y);
      g.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tip.x, tip.y);
      g.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, p0.x, p0.y);
      g.closePath();
      g.fill({ color: bloom < 0.3 ? 0x059669 : petalColor });

      // Rib & striations
      if (bloom > 0.4) {
        g.beginPath();
        g.moveTo(p0.x, p0.y);
        g.lineTo(tip.x, tip.y);
        g.stroke({ color: ribColor, width: 2 * effScale });

        for (let yStep = 18; yStep < len - 8; yStep += 6 * effScale) {
          const span = (1 - (yStep / len)) * (w * 0.7);
          const s1 = pt(-span, yStep);
          const s2 = pt(span, yStep);
          g.beginPath();
          g.moveTo(s1.x, s1.y);
          g.lineTo(s2.x, s2.y);
          g.stroke({ color: ribColor, width: 1 * effScale });
        }
      }
    });

    // Throat
    if (bloom > 0.3) {
      g.circle(cx, cy, 14 * effScale * bloom);
      g.fill({ color: throatColor });
    }

    // Stamens & Golden Anthers
    if (showStamens && bloom > 0.6) {
      const stamenGrowth = (bloom - 0.6) / 0.4;
      for (let s = 0; s < 6; s++) {
        const sAngle = (s * Math.PI * 2) / 6 + 0.2 + rot;
        const sx = cx + Math.cos(sAngle) * (42 * effScale * stamenGrowth);
        const sy = cy + Math.sin(sAngle) * (42 * effScale * stamenGrowth);

        g.beginPath();
        g.moveTo(cx, cy);
        g.quadraticCurveTo(cx + Math.cos(sAngle + 0.3) * 20 * effScale, cy + Math.sin(sAngle + 0.3) * 20 * effScale, sx, sy);
        g.stroke({ color: 0xffffff, width: 1.5 * effScale });

        // Anther Pollen
        g.rect(sx - 3, sy - 2, 6, 4);
        g.fill({ color: 0xfbbf24 });
      }
    }
  }

  public drawVectorSunflower(g: Graphics, cx: number, cy: number, scale = 1.0, bloom = 1.0) {
    const effScale = scale * (0.35 + 0.65 * bloom);
    const outerR = 92 * effScale * bloom;
    const innerR = 40 * effScale * (0.4 + 0.6 * bloom);
    const petalCount = 32;

    if (bloom > 0.2) {
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * 2 * Math.PI) / petalCount;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const pt = (x: number, y: number) => ({
          x: cx + (x * cos - y * sin),
          y: cy + (x * sin + y * cos),
        });

        const p0 = pt(0, innerR);
        const cp1 = pt(-12 * effScale, innerR + 25 * effScale);
        const tip = pt(0, outerR);
        const cp2 = pt(12 * effScale, innerR + 25 * effScale);

        g.beginPath();
        g.moveTo(p0.x, p0.y);
        g.bezierCurveTo(cp1.x, cp1.y, tip.x, tip.y, tip.x, tip.y);
        g.bezierCurveTo(tip.x, tip.y, cp2.x, cp2.y, p0.x, p0.y);
        g.closePath();
        g.fill({ color: i % 2 === 0 ? 0xffb300 : 0xf59e0b });
      }
    }

    // Central Fibonacci Disc
    const floretCount = Math.floor(220 * bloom);
    const goldenAngle = 2.39996323;
    for (let n = 1; n <= floretCount; n++) {
      const r = 2.4 * Math.sqrt(n) * effScale * (0.5 + 0.5 * bloom);
      const theta = n * goldenAngle;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      const col = r / innerR > 0.8 ? 0xb45309 : r / innerR > 0.4 ? 0x78350f : 0x451a03;
      g.circle(x, y, 1.4 * effScale);
      g.fill({ color: col });
    }
  }

  public drawVectorDaisy(g: Graphics, cx: number, cy: number, scale = 1.0, bloom = 1.0) {
    const effScale = scale * (0.4 + 0.6 * bloom);
    const outerR = 75 * effScale * bloom;
    const innerR = 24 * effScale;
    const count = 24;

    if (bloom > 0.25) {
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const pt = (x: number, y: number) => ({
          x: cx + (x * cos - y * sin),
          y: cy + (x * sin + y * cos),
        });

        const p0 = pt(0, innerR);
        const tip = pt(0, outerR);
        g.beginPath();
        g.moveTo(p0.x, p0.y);
        g.bezierCurveTo(pt(-6 * effScale, innerR + 15 * effScale).x, pt(-6 * effScale, innerR + 15 * effScale).y, tip.x, tip.y, tip.x, tip.y);
        g.bezierCurveTo(tip.x, tip.y, pt(6 * effScale, innerR + 15 * effScale).x, pt(6 * effScale, innerR + 15 * effScale).y, p0.x, p0.y);
        g.closePath();
        g.fill({ color: i % 2 === 0 ? 0xffffff : 0xf1f5f9 });
      }
    }

    g.circle(cx, cy, innerR);
    g.fill({ color: 0xfacc15 });
  }

  public drawVectorTulip(g: Graphics, cx: number, cy: number, scale = 1.0, color = 0xfef08a, stemH = 140, bloom = 1.0) {
    const effScale = scale * (0.4 + 0.6 * bloom);
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx, cy + stemH * effScale);
    g.stroke({ color: 0x10b981, width: 3 * effScale });

    const w = 26 * effScale * (0.4 + 0.6 * bloom);
    const h = 70 * effScale * (0.5 + 0.5 * bloom);
    g.beginPath();
    g.moveTo(cx, cy + 10);
    g.bezierCurveTo(cx - w, cy - 15, cx - w * 0.8, cy - h, cx, cy - h);
    g.bezierCurveTo(cx + w * 0.8, cy - h, cx + w, cy - 15, cx, cy + 10);
    g.closePath();
    g.fill({ color });
  }

  public drawVectorLavender(g: Graphics, cx: number, cy: number, scale = 1.0, color = 0xc084fc, stemH = 160, bloom = 1.0) {
    const effScale = scale;
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx, cy + stemH * effScale);
    g.stroke({ color: 0x059669, width: 2.5 * effScale });

    const whorls = Math.floor(12 * bloom);
    for (let w = 0; w < whorls; w++) {
      const wy = cy - w * 10 * effScale;
      const spread = (8 + (12 - w) * 0.8) * effScale * bloom;
      g.ellipse(cx - spread, wy, 5 * effScale, 3.5 * effScale);
      g.ellipse(cx + spread, wy, 5 * effScale, 3.5 * effScale);
      g.circle(cx, wy - 2, 3.5 * effScale);
      g.fill({ color: w % 2 === 0 ? color : 0xe879f9 });
    }
  }

  public drawVectorStems(g: Graphics, cx: number, baseY: number, width = 160, height = 150, bloom = 1.0) {
    const stemCount = Math.floor(26 * (0.6 + 0.4 * bloom));
    for (let i = 0; i < stemCount; i++) {
      const startX = cx + ((i - stemCount / 2) / (stemCount / 2)) * (width * 0.9);
      const startY = baseY;
      const endX = cx + ((i - stemCount / 2) / (stemCount / 2)) * (width * 0.35);
      const endY = baseY + height;

      g.beginPath();
      g.moveTo(startX, startY);
      g.quadraticCurveTo(cx + (startX - cx) * 0.6, baseY + height * 0.5, endX, endY);
      g.stroke({ color: i % 2 === 0 ? 0x10b981 : 0x059669, width: 2.8 });

      if (i % 3 === 0 && bloom > 0.4) {
        const midY = baseY + height * 0.4 + (i % 5) * 8;
        const midX = cx + (startX - cx) * 0.6;
        const dir = i < stemCount / 2 ? -1 : 1;
        g.ellipse(midX + dir * 18, midY, 20 * bloom, 4);
        g.fill({ color: 0x34d399 });
      }
    }
  }

  // ==========================================
  // VECTOR GIFTS: PLUSHIES & CHOCOLATES
  // ==========================================

  public renderGift(giftType: 'teddy' | 'chocolates' | 'locket') {
    this.bouquetContainer.removeChildren();
    this.textContainer.removeChildren();

    const cx = this.app.screen.width / 2;
    const cy = this.app.screen.height * 0.46;
    const g = new Graphics();

    let titleText = '';
    let subText = '';
    let titleColor = 0xfde68a;

    if (giftType === 'teddy') {
      this.drawVectorTeddy(g, cx, cy, 1.2);
      titleText = '✦ CUDDLY BARNABY BEAR FOR SREEPARNA ✦';
      subText = '♥ ISHAN LOVES YOU TO THE STARS & BEYOND ♥';
      titleColor = 0xfde68a;
    } else if (giftType === 'chocolates') {
      this.drawVectorChocolates(g, cx, cy + 20, 1.25);
      titleText = '✦ BELGIAN ARTISAN TRUFFLES FOR SREEPARNA ✦';
      subText = '♥ SWEETER THAN A THOUSAND CHOCOLATES ♥';
      titleColor = 0xfef08a;
    } else if (giftType === 'locket') {
      this.drawVectorLocket(g, cx, cy + 20, 1.2);
      titleText = '✦ HEIRLOOM GOLDEN LOCKET • S ♥ I ✦';
      subText = '♥ S ♥ I — MY HEART IS LOCKED WITH YOURS FOREVER ♥';
      titleColor = 0xfef08a;
    }

    if (titleText) {
      const titleStyle = new TextStyle({
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 18,
        fontWeight: 'bold',
        fill: titleColor,
        letterSpacing: 1.5,
        align: 'center',
      });
      const subStyle = new TextStyle({
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11.5,
        fill: 0xfb7185,
        letterSpacing: 1,
        align: 'center',
      });

      const title = new Text({ text: titleText, style: titleStyle });
      title.anchor.set(0.5);
      title.position.set(cx, 48);

      const subtitle = new Text({ text: subText, style: subStyle });
      subtitle.anchor.set(0.5);
      subtitle.position.set(cx, 74);

      this.textContainer.addChild(title);
      this.textContainer.addChild(subtitle);
    }

    this.bouquetContainer.addChild(g);
  }

  public drawVectorTeddy(g: Graphics, cx: number, cy: number, scale = 1.0) {
    // Body & belly
    g.ellipse(cx, cy + 60 * scale, 52 * scale, 60 * scale);
    g.fill({ color: 0xb45309 });

    g.ellipse(cx, cy + 65 * scale, 34 * scale, 40 * scale);
    g.fill({ color: 0xfde68a });

    // Head
    g.circle(cx, cy - 10 * scale, 48 * scale);
    g.fill({ color: 0xb45309 });

    // Ears
    g.circle(cx - 42 * scale, cy - 45 * scale, 20 * scale);
    g.circle(cx + 42 * scale, cy - 45 * scale, 20 * scale);
    g.fill({ color: 0xb45309 });
    g.circle(cx - 42 * scale, cy - 45 * scale, 12 * scale);
    g.circle(cx + 42 * scale, cy - 45 * scale, 12 * scale);
    g.fill({ color: 0xfbcfe8 });

    // Muzzle & nose
    g.ellipse(cx, cy + 2 * scale, 24 * scale, 18 * scale);
    g.fill({ color: 0xfde68a });
    g.circle(cx, cy - 3 * scale, 7 * scale);
    g.fill({ color: 0x451a03 });

    // Eyes
    g.circle(cx - 18 * scale, cy - 15 * scale, 6 * scale);
    g.circle(cx + 18 * scale, cy - 15 * scale, 6 * scale);
    g.fill({ color: 0x1c1917 });

    // Hugged Sunflower
    this.drawVectorSunflower(g, cx, cy + 50 * scale, 0.55 * scale, 1.0);
  }

  public drawVectorChocolates(g: Graphics, cx: number, cy: number, scale = 1.0) {
    // Heart Box
    g.beginPath();
    g.moveTo(cx, cy + 30 * scale);
    g.bezierCurveTo(cx - 110 * scale, cy - 70 * scale, cx - 70 * scale, cy - 140 * scale, cx, cy - 80 * scale);
    g.bezierCurveTo(cx + 70 * scale, cy - 140 * scale, cx + 110 * scale, cy - 70 * scale, cx, cy + 30 * scale);
    g.closePath();
    g.fill({ color: 0x991b1b });
    g.stroke({ color: 0xfacc15, width: 4 * scale });

    // Assorted Truffles
    const chocs = [
      { x: -35, y: -70, col: 0x291307 },
      { x: 35, y: -70, col: 0xf8fafc },
      { x: 0, y: -50, col: 0xdc2626 },
      { x: -45, y: -30, col: 0x78350f },
      { x: 45, y: -30, col: 0x15803d },
      { x: 0, y: -15, col: 0xd97706 },
    ];
    chocs.forEach((c) => {
      g.circle(cx + c.x * scale, cy + c.y * scale, 14 * scale);
      g.fill({ color: c.col });
      g.stroke({ color: 0xfacc15, width: 1.5 * scale });
    });
  }

  public drawVectorLocket(g: Graphics, cx: number, cy: number, scale = 1.0) {
    // Chain
    g.beginPath();
    g.moveTo(cx - 80 * scale, cy - 160 * scale);
    g.quadraticCurveTo(cx, cy - 60 * scale, cx, cy - 30 * scale);
    g.moveTo(cx + 80 * scale, cy - 160 * scale);
    g.quadraticCurveTo(cx, cy - 60 * scale, cx, cy - 30 * scale);
    g.stroke({ color: 0xfbbf24, width: 2 * scale });

    // Gold Heart Locket Case
    g.beginPath();
    g.moveTo(cx, cy + 70 * scale);
    g.bezierCurveTo(cx - 100 * scale, cy - 20 * scale, cx - 65 * scale, cy - 80 * scale, cx, cy - 30 * scale);
    g.bezierCurveTo(cx + 65 * scale, cy - 80 * scale, cx + 100 * scale, cy - 20 * scale, cx, cy + 70 * scale);
    g.closePath();
    g.fill({ color: 0xeab308 });
    g.stroke({ color: 0xca8a04, width: 3.5 * scale });

    // Inner Ruby Medallion
    g.beginPath();
    g.moveTo(cx, cy + 48 * scale);
    g.bezierCurveTo(cx - 68 * scale, cy - 10 * scale, cx - 44 * scale, cy - 54 * scale, cx, cy - 20 * scale);
    g.bezierCurveTo(cx + 44 * scale, cy - 54 * scale, cx + 68 * scale, cy - 10 * scale, cx, cy + 48 * scale);
    g.closePath();
    g.fill({ color: 0x831843 });
    g.stroke({ color: 0xfacc15, width: 2 * scale });
  }

  public destroy() {
    try {
      if (this.app) {
        // PixiJS v8 bug safeguard during React 18/19 StrictMode mount/unmount cycles
        const appAny = this.app as unknown as Record<string, unknown>;
        if (typeof appAny._cancelResize !== 'function') {
          appAny._cancelResize = () => {};
        }
        if (this.app.renderer) {
          this.app.destroy(false, { children: true });
        }
      }
    } catch {
      // Safe cleanup during dev hot-reloads
    }
  }
}
