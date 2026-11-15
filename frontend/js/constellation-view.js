/**
 * frontend/js/constellation-view.js
 * Mode 2: Bioluminescent Force-Directed Ecosystem Graph (matching design.mp4)
 */

class ConstellationView {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.graphData = null;
    this.nodes = [];
    this.links = [];
    this.activeYear = 'ALL';
    this.activeFilter = 'all';
    this.hoverNode = null;
    this.selectedNode = null;

    // Viewport transform
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.animId = null;
  }

  async init() {
    if (!this.canvas) return;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupInteractions();

    const data = await window.dataLoader.loadConstellationGraph();
    if (data) {
      this.graphData = data;
      this.initSimulation(data);
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.panX = rect.width / 2;
    this.panY = rect.height / 2;
  }

  setupInteractions() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStart = { x: e.clientX - this.panX, y: e.clientY - this.panY };
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.panX = e.clientX - this.dragStart.x;
        this.panY = e.clientY - this.dragStart.y;
      } else {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.panX) / this.zoom;
        const mouseY = (e.clientY - rect.top - this.panY) / this.zoom;
        this.checkHover(mouseX, mouseY);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      this.zoom = Math.max(0.35, Math.min(3.5, this.zoom * zoomFactor));
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.hoverNode) {
        this.handleNodeClick(this.hoverNode);
      }
    });

    // Timeline Scrubber Buttons
    document.querySelectorAll('.timeline-year-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.timeline-year-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeYear = btn.dataset.year;
      });
    });

    // Toolbar Filter Buttons
    document.querySelectorAll('.constellation-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.constellation-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter;
      });
    });
  }

  initSimulation(data) {
    this.nodes = data.nodes.map((n, i) => {
      const angle = (i / data.nodes.length) * Math.PI * 2;
      const dist = n.type === 'hub' ? 0 : (n.type === 'competition' ? 140 : (n.type === 'team' ? 260 : 360));
      return {
        ...n,
        x: Math.cos(angle) * dist + (Math.random() - 0.5) * 40,
        y: Math.sin(angle) * dist + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
      };
    });

    // Map links to node objects
    const nodeMap = new Map(this.nodes.map(n => [n.id, n]));
    this.links = data.links
      .filter(l => nodeMap.has(l.source) && nodeMap.has(l.target))
      .map(l => ({
        source: nodeMap.get(l.source),
        target: nodeMap.get(l.target),
        value: l.value || 1
      }));

    this.startLoop();
  }

  startLoop() {
    const loop = () => {
      this.updatePhysics();
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  updatePhysics() {
    // Gentle force layout dampening
    const kRepel = 800;
    const kSpring = 0.003;
    const friction = 0.88;

    // Repulsion between close nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const distSq = dx * dx + dy * dy + 100;
        if (distSq < 40000) {
          const force = kRepel / distSq;
          const fx = (dx / Math.sqrt(distSq)) * force;
          const fy = (dy / Math.sqrt(distSq)) * force;
          n1.vx -= fx;
          n1.vy -= fy;
          n2.vx += fx;
          n2.vy += fy;
        }
      }
    }

    // Spring links
    for (const l of this.links) {
      const dx = l.target.x - l.source.x;
      const dy = l.target.y - l.source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const targetDist = l.source.type === 'hub' ? 140 : 100;
      const force = (dist - targetDist) * kSpring;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      l.source.vx += fx;
      l.source.vy += fy;
      l.target.vx -= fx;
      l.target.vy -= fy;
    }

    // Centering & Integration
    for (const n of this.nodes) {
      if (n.type === 'hub') {
        n.x = 0;
        n.y = 0;
        continue;
      }
      n.vx -= n.x * 0.001;
      n.vy -= n.y * 0.001;
      n.vx *= friction;
      n.vy *= friction;
      n.x += n.vx;
      n.y += n.vy;
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.zoom, this.zoom);

    // 1. Render Bioluminescent Links
    for (const l of this.links) {
      ctx.beginPath();
      ctx.moveTo(l.source.x, l.source.y);
      ctx.lineTo(l.target.x, l.target.y);
      ctx.strokeStyle = l.source.type === 'hub'
        ? 'rgba(0, 229, 255, 0.18)'
        : 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = l.value || 1;
      ctx.stroke();
    }

    // 2. Render Nodes with Neon Outer Glow
    for (const n of this.nodes) {
      const isHover = n === this.hoverNode;
      const isSelected = n === this.selectedNode;
      const rad = n.radius * (isHover ? 1.3 : 1.0);

      // Node aura glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, rad * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = n.color ? `${n.color}22` : 'rgba(0, 229, 255, 0.15)';
      ctx.fill();

      // Node body
      ctx.beginPath();
      ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = n.color || '#00e5ff';
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = isSelected ? '#ffffff' : (isHover ? '#ff5733' : 'rgba(255,255,255,0.85)');
      ctx.stroke();

      // Labels on hover or important nodes
      if (isHover || n.type === 'hub' || (n.type === 'competition' && n.is_ipl)) {
        ctx.font = `${isHover ? 'bold 12px' : '10px'} var(--font-sans)`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, n.y + rad + 14);
      }
    }

    ctx.restore();
  }

  checkHover(mx, my) {
    let found = null;
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i];
      const dx = n.x - mx;
      const dy = n.y - my;
      if (dx * dx + dy * dy <= (n.radius + 6) * (n.radius + 6)) {
        found = n;
        break;
      }
    }
    this.hoverNode = found;
    this.canvas.style.cursor = found ? 'pointer' : (this.isDragging ? 'grabbing' : 'grab');
  }

  handleNodeClick(node) {
    this.selectedNode = node;
    if (node.type === 'player') {
      const pid = node.id.replace('player_', '');
      // Trigger radial drilldown tree & open glass inspector drawer
      if (window.radialTree) {
        window.radialTree.render(pid);
      }
    }
  }
}

window.ConstellationView = ConstellationView;
