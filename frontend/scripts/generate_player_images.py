#!/usr/bin/env python3
"""
frontend/scripts/generate_player_images.py
Generates 640x820 transparent hero cutouts and 128x128 avatars for all active players
in Data Pack/ball_by_ball.csv, plus SVG team badges for all teams.

Dependencies:
    pip install pandas pillow requests
"""

import os
import io
import json
import hashlib
from pathlib import Path
import pandas as pd
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_PACK_DIR = ROOT_DIR / "Data Pack"
ASSETS_DIR = ROOT_DIR / "frontend" / "public" / "assets"
CUTOUTS_DIR = ASSETS_DIR / "players" / "cutouts"
AVATARS_DIR = ASSETS_DIR / "players" / "avatars"
TEAMS_DIR = ASSETS_DIR / "teams"

for d in (CUTOUTS_DIR, AVATARS_DIR, TEAMS_DIR):
    d.mkdir(parents=True, exist_ok=True)

# Franchise & National Team Palette Registry
TEAM_PALETTES = {
    "Rajasthan Royals": ("#EA1A85", "#254AA5", "#FFD700"),
    "Chennai Super Kings": ("#F9CD05", "#005DA0", "#FF5733"),
    "Mumbai Indians": ("#004BA0", "#D1AB3E", "#38BDF8"),
    "Royal Challengers Bengaluru": ("#EC1C24", "#1D1D1B", "#D1AB3E"),
    "Royal Challengers Bangalore": ("#EC1C24", "#1D1D1B", "#D1AB3E"),
    "Sunrisers Hyderabad": ("#FF822A", "#1E1E1E", "#FACC15"),
    "Kolkata Knight Riders": ("#3A225D", "#B3A123", "#A855F7"),
    "Delhi Capitals": ("#00008B", "#EF1B23", "#60A5FA"),
    "Punjab Kings": ("#ED1B24", "#DCDDDF", "#FBBF24"),
    "Gujarat Titans": ("#1B2133", "#DBBE6E", "#38BDF8"),
    "Lucknow Super Giants": ("#0057E2", "#F26522", "#34D399"),
    "India": ("#005DA0", "#FF9933", "#38BDF8"),
    "Australia": ("#FFCD00", "#006A4E", "#34D399"),
    "England": ("#15295E", "#CE1124", "#60A5FA"),
    "South Africa": ("#007749", "#FFB81C", "#34D399"),
    "New Zealand": ("#1A1A24", "#C0C0C0", "#38BDF8"),
    "West Indies": ("#7B0041", "#FBC02D", "#F43F5E"),
    "Pakistan": ("#01411C", "#A7F3D0", "#10B981"),
    "Sri Lanka": ("#00205B", "#FFB81C", "#38BDF8"),
    "Afghanistan": ("#0066B2", "#D21034", "#60A5FA"),
    "Bangladesh": ("#006A4E", "#F42A41", "#34D399"),
    "Ireland": ("#009A44", "#FFFFFF", "#38BDF8"),
    "Zimbabwe": ("#D40000", "#FFD200", "#007A3D"),
    "Netherlands": ("#FF4F00", "#00205B", "#FFFFFF"),
    "Scotland": ("#002B7F", "#FFFFFF", "#F43F5E"),
    "USA": ("#0A3161", "#B31942", "#FFFFFF"),
    "Namibia": ("#002F6C", "#C8102E", "#F4B223"),
    "Nepal": ("#DC143C", "#003893", "#FFFFFF"),
    "Oman": ("#C8102E", "#008000", "#FFFFFF"),
    "Papua New Guinea": ("#000000", "#DA121A", "#FFCD00"),
    "Uganda": ("#000000", "#FCDC04", "#D90000"),
    "Canada": ("#D80621", "#FFFFFF", "#1E1E1E"),
}


def get_team_colors(team_name: str):
    if team_name in TEAM_PALETTES:
        return TEAM_PALETTES[team_name]
    # Deterministic vibrant color triplet from hash
    h = int(hashlib.md5(str(team_name).encode()).hexdigest()[:6], 16)
    r = max(50, (h >> 16) & 255)
    g = max(40, (h >> 8) & 255)
    b = max(80, h & 255)
    primary = f"#{r:02x}{g:02x}{b:02x}"
    secondary = "#1F1538"
    accent = "#FF5733"
    return (primary, secondary, accent)


def hex_to_rgb(hex_code: str):
    hex_code = hex_code.lstrip("#")
    if len(hex_code) == 3:
        hex_code = "".join([c * 2 for c in hex_code])
    return tuple(int(hex_code[i:i + 2], 16) for i in (0, 2, 4))


def render_athletic_hero_cutout(pinfo: dict) -> Image.Image:
    """
    Renders a 640x820 transparent waist-up athlete cutout matching design.webp:
    - Team-colored directional aura backlight
    - Realistic athletic shoulder & torso geometry
    - Team jersey stripes, trim, and chest emblem
    - Stylized head, neck, facial jawline, and hairstyle
    - Role-specific equipment (willow cricket bat on shoulder / raised bowling seam ball)
    - Gold crown or laurel for Top-10 players
    """
    W, H = 640, 820
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    team_name = pinfo.get("primary_team_name", "Rajasthan Royals")
    primary_hex, secondary_hex, accent_hex = get_team_colors(team_name)
    p_rgb = hex_to_rgb(primary_hex)
    s_rgb = hex_to_rgb(secondary_hex)
    a_rgb = hex_to_rgb(accent_hex)

    is_top10 = pinfo.get("is_top10", False)
    rank = pinfo.get("rank")
    role = pinfo.get("role", "Batter")
    pname = pinfo.get("player_name", "Athlete")
    initials = "".join([part[0].upper() for part in pname.split()[:2]]) or "RR"

    # 1. Atmospheric Backlight Aura Glow (smooth Gaussian blur)
    aura = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    aura_draw = ImageDraw.Draw(aura)
    glow_color = (*p_rgb, 90) if not is_top10 else (255, 130, 42, 140)
    aura_draw.ellipse((80, 100, 560, 680), fill=glow_color)
    aura = aura.filter(ImageFilter.GaussianBlur(radius=56))
    img.alpha_composite(aura)

    draw = ImageDraw.Draw(img)

    # 2. Athletic Torso & Shoulders (Waist-Up 3D Geometry)
    # Jersey Shadow Underlayer
    torso_shadow = [
        (115, 820), (140, 420), (195, 335), (255, 315),
        (385, 315), (445, 335), (500, 420), (525, 820)
    ]
    draw.polygon(torso_shadow, fill=(*s_rgb, 255))

    # Main Jersey Front Panel
    torso_main = [
        (130, 820), (155, 430), (205, 345), (265, 325),
        (375, 325), (435, 345), (485, 430), (510, 820)
    ]
    draw.polygon(torso_main, fill=(*p_rgb, 255), outline=(*a_rgb, 255))

    # Left & Right Athletic Contour Side Panels (for 3D depth)
    left_panel = [(130, 820), (155, 430), (205, 345), (230, 450), (200, 820)]
    draw.polygon(left_panel, fill=(max(0, p_rgb[0] - 35), max(0, p_rgb[1] - 35), max(0, p_rgb[2] - 35), 255))

    right_panel = [(510, 820), (485, 430), (435, 345), (410, 450), (440, 820)]
    draw.polygon(right_panel, fill=(max(0, p_rgb[0] - 45), max(0, p_rgb[1] - 45), max(0, p_rgb[2] - 45), 255))

    # Dynamic Diagonal Jersey Streaks (Sportswear design accents)
    draw.line([(220, 820), (320, 490)], fill=(*a_rgb, 200), width=6)
    draw.line([(245, 820), (345, 490)], fill=(255, 255, 255, 180), width=3)

    # Jersey V-Neck & Collar Ribbing
    collar_poly = [(265, 325), (320, 405), (375, 325), (355, 325), (320, 385), (285, 325)]
    draw.polygon(collar_poly, fill=(*s_rgb, 255), outline=(*a_rgb, 255))

    # 3. Athletic Neck & Jawline
    # Neck shadow
    draw.polygon([(290, 260), (350, 260), (345, 345), (295, 345)], fill=(125, 75, 38, 255))
    # Neck highlight
    draw.polygon([(298, 260), (342, 260), (338, 335), (302, 335)], fill=(155, 96, 52, 255))

    # Athletic Head & Jawline Contour
    # Chin & Jawline
    jaw_poly = [(270, 160), (260, 215), (285, 265), (320, 280), (355, 265), (380, 215), (370, 160)]
    draw.polygon(jaw_poly, fill=(170, 108, 60, 255), outline=(*a_rgb, 120))
    # Upper Cranium
    draw.ellipse((255, 110, 385, 240), fill=(170, 108, 60, 255))

    # Hairstyle Silhouette
    hair_poly = [
        (250, 165), (245, 130), (265, 95), (320, 85),
        (375, 95), (395, 130), (390, 165), (375, 145),
        (320, 140), (265, 145)
    ]
    draw.polygon(hair_poly, fill=(28, 20, 18, 255))

    # Athletic Eyeline Visor & Features (Subtle geometric stylization)
    draw.arc((280, 175, 310, 195), 190, 350, fill=(45, 25, 15, 255), width=2)
    draw.arc((330, 175, 360, 195), 190, 350, fill=(45, 25, 15, 255), width=2)
    # Nose bridge & mouth contour
    draw.line([(320, 190), (318, 225), (325, 227)], fill=(130, 78, 40, 255), width=2)
    draw.line([(310, 245), (330, 245)], fill=(120, 65, 35, 255), width=2)

    # 4. Cricket Equipment Accents
    if role in ("Batter", "All-Rounder"):
        # Cricket Bat over Right Shoulder (English Willow texture with rubber grip)
        # Bat Blade
        blade_poly = [(425, 380), (495, 80), (540, 95), (465, 395)]
        draw.polygon(blade_poly, fill=(235, 180, 100, 255), outline=(255, 255, 255, 255))
        # Willow grain lines
        draw.line([(455, 385), (512, 85)], fill=(205, 150, 75, 255), width=2)
        draw.line([(475, 390), (525, 90)], fill=(205, 150, 75, 255), width=2)
        # Colored Handle Grip
        handle_poly = [(495, 80), (518, -10), (538, -5), (515, 85)]
        draw.polygon(handle_poly, fill=(*p_rgb, 255), outline=(255, 255, 255, 255))
    else:
        # Seam Cricket Ball held in Raised Hand
        draw.ellipse((415, 440, 515, 540), fill=(210, 30, 30, 255), outline=(255, 255, 255, 255), width=2)
        # Prominent white stitched seam
        draw.arc((420, 445, 510, 535), 45, 225, fill=(255, 255, 255, 255), width=4)
        draw.arc((425, 450, 505, 530), 45, 225, fill=(240, 240, 240, 255), width=2)

    # 5. Team Chest Crest & Monogram Emblem (Matches design.webp 'L1' jersey badge)
    crest_center = (280, 450)
    draw.ellipse((crest_center[0] - 28, crest_center[1] - 28, crest_center[0] + 28, crest_center[1] + 28),
                 fill=(*s_rgb, 240), outline=(*a_rgb, 255), width=2)
    # Monogram text
    draw.text((crest_center[0] - 12, crest_center[1] - 10), initials[:2], fill=(255, 255, 255, 255))

    # 6. Top-10 Crown / Gold Trim Laurels
    if is_top10 and rank:
        # Gold Crown above Head
        crown_pts = [
            (290, 70), (300, 45), (312, 60), (320, 35),
            (328, 60), (340, 45), (350, 70)
        ]
        draw.polygon(crown_pts, fill=(255, 215, 0, 255), outline=(255, 255, 255, 255))
        draw.rectangle((290, 70, 350, 76), fill=(255, 180, 0, 255))
        # Gem on crown
        draw.ellipse((316, 48, 324, 56), fill=(255, 87, 51, 255))

    return img


def generate_team_svg(team_id: int, team_name: str) -> str:
    """Generates a crisp geometric SVG crest for a cricket team."""
    primary, secondary, accent = get_team_colors(team_name)
    initials = "".join([part[0].upper() for part in team_name.split()[:3]]) or "RR"

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="shieldGrad_{team_id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{primary}" />
      <stop offset="100%" stop-color="{secondary}" />
    </linearGradient>
    <filter id="glow_{team_id}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="{primary}" flood-opacity="0.45" />
    </filter>
  </defs>
  <!-- Outer Shield Shape -->
  <path d="M 60,10 L 105,25 L 105,65 C 105,92 60,112 60,112 C 60,112 15,92 15,65 L 15,25 Z"
        fill="url(#shieldGrad_{team_id})" stroke="{accent}" stroke-width="3" filter="url(#glow_{team_id})" />
  <!-- Inner Ring -->
  <circle cx="60" cy="58" r="32" fill="{secondary}" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="4,2" />
  <!-- Crossed Cricket Bats Silhouette -->
  <line x1="42" y1="76" x2="78" y2="40" stroke="{accent}" stroke-width="3" stroke-linecap="round" />
  <line x1="78" y1="76" x2="42" y2="40" stroke="{accent}" stroke-width="3" stroke-linecap="round" />
  <!-- Team Initials Monogram -->
  <text x="60" y="64" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
    {initials}
  </text>
  <!-- Top Star Accent -->
  <polygon points="60,20 63,27 70,27 65,32 67,39 60,35 53,39 55,32 50,27 57,27" fill="#FFD700" />
</svg>"""


def generate_all_assets():
    print("1. Loading players master index from build_frontend_data.py...")
    master_path = ROOT_DIR / "frontend" / "public" / "data" / "players_master_index.json"
    if not master_path.exists():
        print("Error: players_master_index.json not found! Running build_frontend_data.py first...")
        import subprocess
        subprocess.run(["python", str(ROOT_DIR / "frontend" / "scripts" / "build_frontend_data.py")], check=True)

    with open(master_path, "r", encoding="utf-8") as f:
        master_data = json.load(f)

    players = master_data["players"]
    print(f"Generating cutouts and avatars for {len(players)} active players...")

    generated_count = 0
    for p in players:
        pid = p["player_id"]
        cutout_file = CUTOUTS_DIR / f"{pid}.webp"
        avatar_file = AVATARS_DIR / f"{pid}.webp"

        # Check if is_top10
        is_top10 = p["batting_eb"].get("is_top10") or p["bowling_eb"].get("is_top10")
        rank = p["batting_eb"].get("rank") or p["bowling_eb"].get("rank")
        p["is_top10"] = is_top10
        p["rank"] = rank

        # Synthesize athletic cutout
        cutout_img = render_athletic_hero_cutout(p)
        cutout_img.save(cutout_file, "WEBP", quality=85, method=4)

        # 128x128 circular headshot avatar
        avatar_crop = cutout_img.crop((160, 60, 480, 380)).resize((128, 128), Image.Resampling.LANCZOS)
        avatar_file_path = AVATARS_DIR / f"{pid}.webp"
        avatar_crop.save(avatar_file_path, "WEBP", quality=85)

        generated_count += 1
        if generated_count % 150 == 0 or generated_count == len(players):
            print(f"  Generated {generated_count}/{len(players)} player assets...")

    print("Completed generating all player cutouts and avatars!")

    # Generate 353 Team SVGs
    print("2. Generating 353 SVG team crests...")
    teams_df = pd.read_csv(DATA_PACK_DIR / "teams.csv")
    unique_teams = teams_df.drop_duplicates(subset=["team_id"])

    team_count = 0
    for _, tr in unique_teams.iterrows():
        tid = int(tr["team_id"])
        tname = str(tr["team_name"])
        svg_content = generate_team_svg(tid, tname)
        with open(TEAMS_DIR / f"{tid}.svg", "w", encoding="utf-8") as tf:
            tf.write(svg_content)
        team_count += 1

    # Also add default 0.svg for 'International XI'
    with open(TEAMS_DIR / "0.svg", "w", encoding="utf-8") as tf:
        tf.write(generate_team_svg(0, "International XI"))

    print(f"Completed generating {team_count + 1} SVG team crests into public/assets/teams/!")


if __name__ == "__main__":
    generate_all_assets()
