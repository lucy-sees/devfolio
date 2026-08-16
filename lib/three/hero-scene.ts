// lib/three/hero-scene.ts
// Vanilla three.js (no react-three-fiber) so there's no risk of duplicate
// React instances or renderer/DOM reconciliation clashes with React 19.
import * as THREE from "three";

const PINK = 0xff5fc4;
const VIOLET = 0xb490ff;
const MINT = 0x5af78e;
const GOLD = 0xf4e96b;

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private core: THREE.Group;
  private particles: THREE.Points;
  private frameId = 0;
  private resizeObserver: ResizeObserver;
  private clock = new THREE.Clock();
  private reduceMotion: boolean;

  constructor(private canvas: HTMLCanvasElement) {
    this.reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 7);

    this.core = this.buildCore();
    this.scene.add(this.core);

    this.particles = this.buildParticles();
    this.scene.add(this.particles);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.PointLight(PINK, 20, 20);
    key.position.set(3, 2, 4);
    this.scene.add(key);
    const rim = new THREE.PointLight(MINT, 14, 20);
    rim.position.set(-3, -2, -3);
    this.scene.add(rim);

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(canvas);
    this.handleResize();

    this.animate();
  }

  /** An icosahedron core wrapped in a wireframe shell — reads as an
   * abstract "code / data" object rather than a literal object, so it
   * fits an IDE-themed hero without competing with the terminal chrome. */
  private buildCore() {
    const group = new THREE.Group();

    const geometry = new THREE.IcosahedronGeometry(1.6, 1);
    const material = new THREE.MeshStandardMaterial({
      color: VIOLET,
      metalness: 0.2,
      roughness: 0.35,
      flatShading: true,
      transparent: true,
      opacity: 0.22,
    });
    group.add(new THREE.Mesh(geometry, material));

    const wireGeometry = new THREE.IcosahedronGeometry(1.62, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: PINK,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    group.add(new THREE.Mesh(wireGeometry, wireMaterial));

    const haloGeometry = new THREE.TorusGeometry(2.4, 0.01, 8, 96);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: GOLD,
      transparent: true,
      opacity: 0.5,
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.rotation.x = Math.PI / 2.4;
    group.add(halo);

    return group;
  }

  private buildParticles() {
    const count = 220;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [PINK, VIOLET, MINT, GOLD];

    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color(palette[i % palette.length]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    return new THREE.Points(geometry, material);
  }

  private handleResize() {
    const { clientWidth, clientHeight } = this.canvas;
    if (!clientWidth || !clientHeight) return;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight, false);
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);
    const elapsed = this.clock.getElapsedTime();
    const speed = this.reduceMotion ? 0.05 : 1;

    this.core.rotation.y = elapsed * 0.18 * speed;
    this.core.rotation.x = Math.sin(elapsed * 0.12 * speed) * 0.3;
    this.particles.rotation.y = -elapsed * 0.05 * speed;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.frameId);
    this.resizeObserver.disconnect();

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry.dispose();
        const material = obj.material;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else {
          material.dispose();
        }
      }
    });

    this.renderer.dispose();
  }
}
