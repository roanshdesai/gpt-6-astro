// A droplet flame rendered as a volume: the fragment shader walks a ray through
// the flame and adds up the light it passes, the way a camera sees a real one.
//
// uGravity runs from 0 (freefall) to 1 (Earth) and reshapes the same flame:
//   Earth    - a teardrop: thin blue skin at the base, bright glowing soot above.
//   Freefall - a dim blue sphere around the fuel, fed only by diffusion.
// Space is in chamber units: the fuel droplet is at the origin.

export const BOX_HALF = [0.9, 1.15, 0.9] as const;
export const BOX_CENTER_Y = 0;

export const flameVertex = /* glsl */ `
  varying vec3 vCam;
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    vCam = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const flameFragment = /* glsl */ `
  precision highp float;
  varying vec3 vCam;
  varying vec3 vLocal;
  uniform float uTime;
  uniform float uGravity;
  uniform vec3 uBoxHalf;
  uniform float uBoxCenterY;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec2 boxHit(vec3 ro, vec3 rd, vec3 b) {
    vec3 inv = 1.0 / rd;
    vec3 t0 = (-b - ro) * inv;
    vec3 t1 = (b - ro) * inv;
    vec3 mn = min(t0, t1);
    vec3 mx = max(t0, t1);
    return vec2(max(max(mn.x, mn.y), mn.z), min(min(mx.x, mx.y), mx.z));
  }

  float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }

  // Smooth 3D noise: gives the flame the slight unevenness a real one has.
  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), u.x),
          mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), u.x), u.y),
      mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), u.x),
          mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), u.x), u.y),
      u.z);
  }

  // Light emitted at one point of the flame. The fuel droplet sits at the
  // origin, held on two crossed fibres (along x and z). Modelled on NASA's
  // photographs: a candle flame in normal gravity, and the FLEX droplet flames
  // on the station, which are thin blue shells with a dim sooty layer inside
  // and fibres that glow where they pass through the flame.
  vec3 emission(vec3 p, float g, float t) {
    // --- Earth: buoyancy pulls the flame into a slender, restless teardrop.
    float H = 1.12 * (1.0 + 0.035 * sin(t * 9.7) + 0.02 * sin(t * 4.3 + 1.7));
    float y = p.y + 0.09;
    float yN = y / H;
    float ripple = vnoise(vec3(p.xz * 3.0, y * 2.5 - t * 2.2)) - 0.5;
    float lean = yN * yN * (0.035 * sin(t * 6.1 + y * 2.2) + 0.02 * sin(t * 2.7));
    float rho = length(p.xz - vec2(lean, 0.0) * g) + ripple * 0.035 * yN * g;
    float inRange = step(0.0, yN) * step(yN, 1.0);
    float profile = 0.15 * pow(max(sin(3.14159 * pow(clamp(yN, 0.0, 1.0), 0.7)), 0.0), 0.85);
    float sEarth = mix(8.0, rho / max(profile, 0.003), inRange);

    // --- Freefall: a sphere around the droplet, very slightly uneven.
    float sFree = length(p) / 0.4 + (vnoise(p * 2.2 + vec3(0.0, 0.0, t * 0.15)) - 0.5) * 0.05;

    float s = mix(sFree, sEarth, g);

    // Blue reaction sheet: a thin skin where fuel vapour meets oxygen. Seen
    // edge-on at the rim it looks bright; seen through, at the centre, faint.
    vec3 blueCol = vec3(0.045, 0.16, 1.0);
    float sheet = exp(-pow((s - 1.0) / 0.082, 2.0));
    // On Earth the blue only shows low down, before the soot outshines it.
    float lowOnly = mix(1.0, smoothstep(0.3, 0.03, yN), g);
    vec3 blue = blueCol * sheet * lowOnly * mix(1.25, 0.8, g);
    blue += blueCol * smoothstep(1.0, 0.5, sFree) * (1.0 - g) * 0.07;

    // Freefall droplet flames carry a dim, patchy layer of soot inside the blue.
    float sootShell = exp(-pow((sFree - 0.52) / 0.1, 2.0)) * (0.6 + 0.8 * vnoise(p * 6.0 + t * 0.2));
    vec3 inner = vec3(1.0, 0.42, 0.1) * sootShell * 0.16 * (1.0 - g);

    // Glowing soot: the bright body. It needs the hot, rising column of Earth.
    float body = smoothstep(1.0, 0.4, s) * smoothstep(0.16, 0.42, yN) * pow(smoothstep(1.02, 0.78, yN), 0.8);
    float lower = smoothstep(1.0, 0.6, s) * smoothstep(0.02, 0.18, yN) * smoothstep(0.46, 0.22, yN) * 0.12;
    // Yellow at the core, red-orange toward the rim and the tip.
    vec3 core = vec3(1.0, 0.74, 0.36);
    vec3 rim = vec3(1.0, 0.2, 0.02);
    vec3 sootCol = mix(core, rim, smoothstep(0.35, 1.0, s));
    sootCol = mix(sootCol, rim, smoothstep(0.7, 1.0, yN) * 0.8);
    vec3 soot = (sootCol * body * 3.3 + vec3(1.0, 0.45, 0.22) * lower * 3.2) * g * g * inRange;

    // The support fibres glow orange where they cross the flame.
    float fibre = exp(-pow(length(p.yz) / 0.026, 2.0)) + exp(-pow(length(p.xy) / 0.026, 2.0));
    float band = smoothstep(1.12, 0.95, s) * smoothstep(0.3, 0.62, s);
    vec3 glow = vec3(1.0, 0.5, 0.16) * fibre * band * mix(2.0, 1.1, g);

    return blue + inner + soot + glow;
  }

  void main() {
    vec3 ro = vCam;
    vec3 rd = normalize(vLocal - vCam);
    vec2 hit = boxHit(ro, rd, uBoxHalf);
    if (hit.y <= max(hit.x, 0.0)) discard;

    float g = smoothstep(0.0, 1.0, uGravity);
    const int STEPS = 64;
    float t0 = max(hit.x, 0.0);
    float dt = (hit.y - t0) / float(STEPS);
    // Jitter the start so the steps never show as bands.
    float tt = t0 + dt * hash12(gl_FragCoord.xy + fract(uTime) * 61.0);

    vec3 sum = vec3(0.0);
    for (int i = 0; i < STEPS; i++) {
      vec3 p = ro + rd * tt;
      p.y += uBoxCenterY;
      sum += emission(p, g, uTime);
      tt += dt;
    }
    vec3 col = sum * dt * 2.6;
    gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0));
  }
`;
