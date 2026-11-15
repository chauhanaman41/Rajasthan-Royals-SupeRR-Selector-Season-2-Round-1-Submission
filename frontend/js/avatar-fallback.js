/**
 * frontend/js/avatar-fallback.js
 * Instant client-side HTML5 Canvas fallback for athlete cutouts and headshot avatars
 */

class AvatarFallback {
  constructor() {
    this.cache = new Map();
  }

  getTeamColor(teamName) {
    if (!teamName) return '#ea1a85';
    let hash = 0;
    for (let i = 0; i < teamName.length; i++) {
      hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

  generateCutout(player) {
    const key = `cutout_${player.player_id}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 820;
    const ctx = canvas.getContext('2d');

    const primaryColor = this.getTeamColor(player.primary_team_name);
    const initials = (player.player_name || 'RR')
      .split(' ')
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    // 1. Backlight Aura Glow
    const radGrad = ctx.createRadialGradient(320, 410, 40, 320, 410, 280);
    radGrad.addColorStop(0, primaryColor + '99');
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 640, 820);

    // 2. Torso Silhouette
    ctx.beginPath();
    ctx.moveTo(130, 820);
    ctx.lineTo(160, 430);
    ctx.lineTo(210, 345);
    ctx.lineTo(270, 325);
    ctx.lineTo(370, 325);
    ctx.lineTo(430, 345);
    ctx.lineTo(480, 430);
    ctx.lineTo(510, 820);
    ctx.closePath();
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // 3. Neck & Head
    ctx.fillStyle = '#a06030';
    ctx.fillRect(290, 260, 60, 80);

    ctx.beginPath();
    ctx.ellipse(320, 190, 65, 80, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#b07040';
    ctx.fill();

    // Hair
    ctx.beginPath();
    ctx.ellipse(320, 150, 68, 50, 0, Math.PI, Math.PI * 2);
    ctx.fillStyle = '#1c1410';
    ctx.fill();

    // Chest Monogram
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(initials, 320, 520);

    const dataUrl = canvas.toDataURL('image/png');
    this.cache.set(key, dataUrl);
    return dataUrl;
  }
}

window.avatarFallback = new AvatarFallback();
