// Interactive 3D scenes — ramindak.com
// Scene 1: Paper plane (follows cursor) + floating sticky-note objects that scatter
// Scene 2: Coffee mug with steam particles (hover / click interactions)
(function () {
  'use strict';

  function boot() {
    if (typeof THREE === 'undefined') { setTimeout(boot, 80); return; }
    var board = document.getElementById('board-home');
    if (!board) { setTimeout(boot, 150); return; }
    initHeroScene(board);
    initMugScene(board);
  }
  boot();

  function isDark() { return document.body.classList.contains('theme-dark'); }

  // ══════════════════════════════════════════════════════════════════════
  // SCENE 1 — full-board canvas: paper plane + floating objects
  // ══════════════════════════════════════════════════════════════════════
  function initHeroScene(board) {
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var el = renderer.domElement;
    Object.assign(el.style, {
      position: 'absolute', top: '0', left: '0',
      pointerEvents: 'none', zIndex: '1',
      opacity: '0', transition: 'opacity 1.2s ease'
    });
    board.appendChild(el);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
    camera.position.z = 18;

    // ── world-half sizes (recalculated on resize) ──────────────────────
    var WH = 1, WW = 1;
    function calcWorld() {
      var vFOV = THREE.MathUtils.degToRad(camera.fov);
      WH = Math.tan(vFOV / 2) * camera.position.z;
      WW = WH * camera.aspect;
    }

    var floatersReady = false;
    function resize() {
      var W = board.offsetWidth  || window.innerWidth;
      var H = board.offsetHeight || window.innerHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      calcWorld();
      if (floatersReady) {
        floaters.forEach(function (f) {
          f.home.x = f.hfx * WW;
          f.home.y = f.hfy * WH;
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);

    // ── lights ────────────────────────────────────────────────────────
    var ambLight = new THREE.AmbientLight(isDark() ? 0x3a2c20 : 0xf4e8cd, 1.5);
    scene.add(ambLight);
    var sun = new THREE.DirectionalLight(0xfff8e0, 1.8);
    sun.position.set(5, 8, 6);
    scene.add(sun);
    var fill = new THREE.DirectionalLight(0xffd0a0, 0.4);
    fill.position.set(-3, -3, 4);
    scene.add(fill);

    // ── paper plane ───────────────────────────────────────────────────
    var PLANE_COL = isDark() ? 0xf6ecd2 : 0xf4e8cd;
    var planeMat = new THREE.MeshPhongMaterial({
      color: PLANE_COL, shininess: 35, specular: 0xffffff, side: THREE.DoubleSide
    });
    var shadowMat = new THREE.MeshPhongMaterial({
      color: isDark() ? 0xd4c8a8 : 0xe8d8b8, shininess: 10, side: THREE.DoubleSide
    });

    var planeGroup = new THREE.Group();

    // fuselage spine
    planeGroup.add(mkBox(0.12, 0.30, 3.4, planeMat, 0, 0, 0));
    // left wing  (sweep back, slight dihedral)
    var lw = mkBox(2.3, 0.045, 1.15, planeMat);
    lw.position.set(-0.95, -0.07, -0.1);
    lw.rotation.set(0, 0.18, -0.06);
    planeGroup.add(lw);
    // right wing
    var rw = mkBox(2.3, 0.045, 1.15, planeMat);
    rw.position.set(0.95, -0.07, -0.1);
    rw.rotation.set(0, -0.18, 0.06);
    planeGroup.add(rw);
    // vertical tail fin
    var tf = mkBox(0.045, 0.50, 0.75, planeMat, 0, 0.22, -1.35);
    planeGroup.add(tf);
    // nose accent
    planeGroup.add(mkBox(0.09, 0.22, 0.55, shadowMat, 0, 0.04, 1.42));

    scene.add(planeGroup);

    // ── floating objects ──────────────────────────────────────────────
    var NOTE_COLS = [0xffe58a, 0xffb7c5, 0xb7e3c2, 0xa9d2ef, 0xd7c2f2, 0xffcfa1];
    var NOTE_COLS_DARK = [0xf2cf5c, 0xf48aa3, 0x7fd19c, 0x8ec3ec, 0xc2a7ef, 0xf2b17a];

    // fractional positions in world space (so they stay on-screen at any size)
    var FRACS = [
      { fx:  0.58, fy:  0.30 },
      { fx: -0.55, fy: -0.22 },
      { fx:  0.72, fy: -0.18 },
      { fx:  0.38, fy: -0.42 },
      { fx: -0.38, fy:  0.38 },
      { fx:  0.62, fy:  0.42 },
    ];

    // star shape helper
    function makeStarGeo(r) {
      var sh = new THREE.Shape();
      for (var i = 0; i < 10; i++) {
        var a = (i * Math.PI / 5) - Math.PI / 2;
        var rad = (i % 2 === 0) ? r : r * 0.42;
        if (i === 0) sh.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else         sh.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      sh.closePath();
      return new THREE.ShapeGeometry(sh);
    }

    var floaters = [];
    FRACS.forEach(function (frac, i) {
      var cols = isDark() ? NOTE_COLS_DARK : NOTE_COLS;
      var mat  = new THREE.MeshPhongMaterial({
        color: cols[i], shininess: 15, side: THREE.DoubleSide
      });
      var geo  = (i % 2 === 0)
        ? new THREE.PlaneGeometry(1.05, 1.05)
        : makeStarGeo(0.55);
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(frac.fx * WW, frac.fy * WH, 0);
      scene.add(mesh);
      floaters.push({
        mesh: mesh, mat: mat,
        home: { x: frac.fx * WW, y: frac.fy * WH },
        hfx: frac.fx, hfy: frac.fy,
        vel: { x: 0, y: 0 },
        phase: i * 1.05,
        rotSpeed: (i % 2 === 0 ? 1 : -1) * (0.003 + i * 0.001),
      });
    });
    floatersReady = true;

    // ── input ─────────────────────────────────────────────────────────
    var mouseWorld = { x: 0, y: 0 };
    var mouseInBoard = false;

    function toWorld(clientX, clientY) {
      var rect = el.getBoundingClientRect();
      var nx   = ((clientX - rect.left) / rect.width)  * 2 - 1;
      var ny   = -((clientY - rect.top)  / rect.height) * 2 + 1;
      mouseInBoard = nx > -1.1 && nx < 1.1 && ny > -1.1 && ny < 1.1;
      mouseWorld.x = nx * WW;
      mouseWorld.y = ny * WH;
    }

    window.addEventListener('mousemove', function (e) { toWorld(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (e.touches[0]) toWorld(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // barrel roll on click/tap anywhere in the hero section
    var rolling = false, rollAngle = 0;

    window.addEventListener('click', function (e) {
      if (rolling) return;
      var rect = el.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right ||
          e.clientY < rect.top  || e.clientY > rect.bottom) return;
      // only if not clicking an interactive child element
      if (e.target.closest('a,button,input,textarea,.draggable')) return;
      rolling = true;
    });
    window.addEventListener('touchend', function (e) {
      if (rolling) return;
      var t = e.changedTouches[0]; if (!t) return;
      var rect = el.getBoundingClientRect();
      if (t.clientX < rect.left || t.clientX > rect.right ||
          t.clientY < rect.top  || t.clientY > rect.bottom) return;
      if (e.target.closest('a,button,input,textarea,.draggable')) return;
      rolling = true;
    }, { passive: true });

    // ── theme sync ────────────────────────────────────────────────────
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        setTimeout(function () {
          var dark = isDark();
          ambLight.color.set(dark ? 0x3a2c20 : 0xf4e8cd);
          planeMat.color.set(dark ? 0xf6ecd2 : 0xf4e8cd);
          shadowMat.color.set(dark ? 0xd0c4a4 : 0xe8d8b8);
          var cols = dark ? NOTE_COLS_DARK : NOTE_COLS;
          floaters.forEach(function (f, i) { f.mat.color.set(cols[i]); });
        }, 40);
      });
    }

    // ── animation ─────────────────────────────────────────────────────
    var planePos = { x: 0, y: 0 };
    var planeVel = { x: 0, y: 0 };
    var time = 0;

    (function loop() {
      requestAnimationFrame(loop);
      time += 0.016;

      // target: follow mouse or gently orbit when idle
      var tx, ty;
      if (mouseInBoard) {
        tx = mouseWorld.x * 0.78;
        ty = mouseWorld.y * 0.78;
      } else {
        tx = Math.cos(time * 0.32) * WW * 0.32;
        ty = Math.sin(time * 0.32) * WH * 0.22 - WH * 0.08;
      }

      planeVel.x = (tx - planePos.x) * 0.046;
      planeVel.y = (ty - planePos.y) * 0.046;
      planePos.x += planeVel.x;
      planePos.y += planeVel.y;

      planeGroup.position.set(planePos.x, planePos.y, 1);
      planeGroup.rotation.y = -planeVel.x * 4.5;   // yaw toward movement
      planeGroup.rotation.x =  planeVel.y * 2.8;   // pitch with vertical

      if (rolling) {
        rollAngle += 0.13;
        planeGroup.rotation.z = rollAngle;
        if (rollAngle >= Math.PI * 2) {
          rolling = false; rollAngle = 0;
          planeGroup.rotation.z = 0;
        }
      } else {
        planeGroup.rotation.z = -planeVel.x * 2.2; // bank with horizontal
      }

      // floating objects — drift + scatter from plane
      floaters.forEach(function (f) {
        var dx   = f.mesh.position.x - planeGroup.position.x;
        var dy   = f.mesh.position.y - planeGroup.position.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        var REPEL = 3.2;

        if (dist < REPEL) {
          var force = ((REPEL - dist) / REPEL) * 0.22;
          f.vel.x += (dx / dist) * force;
          f.vel.y += (dy / dist) * force;
        }

        // spring back to home
        f.vel.x += (f.home.x - f.mesh.position.x) * 0.028;
        f.vel.y += (f.home.y - f.mesh.position.y) * 0.028;

        // damping
        f.vel.x *= 0.87;
        f.vel.y *= 0.87;

        f.mesh.position.x += f.vel.x;
        f.mesh.position.y += f.vel.y;
        f.mesh.position.y += Math.sin(time * 0.55 + f.phase) * 0.007; // float bob

        // gentle spin
        f.mesh.rotation.z += f.rotSpeed;
        f.mesh.rotation.y  = Math.sin(time * 0.38 + f.phase) * 0.18;
      });

      renderer.render(scene, camera);
    })();

    setTimeout(function () { el.style.opacity = '1'; }, 500);
  }

  // ══════════════════════════════════════════════════════════════════════
  // SCENE 2 — coffee mug with steam (hover wobble, click tip-over)
  // ══════════════════════════════════════════════════════════════════════
  function initMugScene(board) {
    var W = 170, H = 200;
    var wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position: 'absolute', bottom: '140px', right: 'clamp(16px, 4vw, 60px)',
      width: W + 'px', height: (H + 22) + 'px',
      zIndex: '3', cursor: 'pointer',
      opacity: '0', transition: 'opacity 1.2s ease',
    });

    var label = document.createElement('div');
    label.textContent = '☕ click me!';
    Object.assign(label.style, {
      fontFamily: '"Patrick Hand", cursive', fontSize: '13px',
      color: 'var(--ink-soft)', textAlign: 'center',
      marginTop: '4px', opacity: '0.75', pointerEvents: 'none',
      userSelect: 'none',
    });

    board.appendChild(wrap);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);
    wrap.appendChild(label);

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0.9, 6.5);
    camera.lookAt(0, 0.1, 0);

    // lights
    scene.add(new THREE.AmbientLight(isDark() ? 0x3a2c20 : 0xf4e8cd, 1.9));
    var mSun = new THREE.DirectionalLight(0xfff0cc, 2.2);
    mSun.position.set(3, 5, 4);
    scene.add(mSun);

    // mug materials
    var mugMat = new THREE.MeshPhongMaterial({
      color: isDark() ? 0x4a3828 : 0xd9bc8a, shininess: 65
    });
    var coffeeMat = new THREE.MeshPhongMaterial({ color: 0x3a2010 });

    var mug = new THREE.Group();

    // body (slightly tapered)
    mug.add(mkMesh(new THREE.CylinderGeometry(0.72, 0.60, 1.65, 32), mugMat));
    // base ring
    mug.add(mkMesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 32), mugMat, 0, -0.86, 0));
    // coffee surface
    mug.add(mkMesh(new THREE.CircleGeometry(0.64, 32), coffeeMat, 0, 0.82, 0,
      -Math.PI / 2, 0, 0));
    // handle via tube
    var curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.70,  0.50, 0),
      new THREE.Vector3(1.32,  0,    0),
      new THREE.Vector3(0.70, -0.50, 0)
    );
    mug.add(mkMesh(new THREE.TubeGeometry(curve, 22, 0.085, 10, false), mugMat));

    scene.add(mug);

    // ── steam particles ───────────────────────────────────────────────
    var PC = 70;
    var sPos = new Float32Array(PC * 3);
    var sLife = new Float32Array(PC);
    var sVX   = new Float32Array(PC);

    function resetParticle(i) {
      sPos[i*3]   = (Math.random() - 0.5) * 0.48;
      sPos[i*3+1] = 0.9;
      sPos[i*3+2] = (Math.random() - 0.5) * 0.3;
      sLife[i]    = Math.random();
      sVX[i]      = (Math.random() - 0.5) * 0.006;
    }
    for (var i = 0; i < PC; i++) { resetParticle(i); sPos[i*3+1] = 0.9 + Math.random() * 1.8; }

    var steamGeo = new THREE.BufferGeometry();
    steamGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    var steamMat = new THREE.PointsMaterial({
      color: 0xe0d8cc, size: 0.19, transparent: true, opacity: 0.50,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(steamGeo, steamMat));

    // ── interaction ───────────────────────────────────────────────────
    var hovering = false, tipped = false;
    var tipAngle = 0, wobbleAmp = 0;
    var touchMoved = false;

    wrap.addEventListener('mouseenter', function () { hovering = true; });
    wrap.addEventListener('mouseleave', function () { hovering = false; });
    wrap.addEventListener('click', function () {
      tipped = !tipped;
      wobbleAmp = 0.06;
    });
    wrap.addEventListener('touchstart', function () {
      hovering = true; wobbleAmp = 0.04; touchMoved = false;
    }, { passive: true });
    wrap.addEventListener('touchmove',  function () { touchMoved = true; }, { passive: true });
    wrap.addEventListener('touchend',   function () {
      hovering = false;
      if (!touchMoved) { tipped = !tipped; }
    }, { passive: true });

    // theme sync
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        setTimeout(function () {
          mugMat.color.set(isDark() ? 0x4a3828 : 0xd9bc8a);
        }, 40);
      });
    }

    // ── animation ─────────────────────────────────────────────────────
    var time = 0, steamFactor = 1;

    (function loop() {
      requestAnimationFrame(loop);
      time += 0.016;

      steamFactor += ((hovering ? 2.0 : 1.0) - steamFactor) * 0.06;

      // tip over / right
      var tipTarget = tipped ? -1.15 : 0;
      tipAngle += (tipTarget - tipAngle) * 0.055;
      mug.rotation.z = tipAngle;
      mug.position.x = tipAngle * 0.28;

      // hover wobble
      wobbleAmp *= 0.91;
      mug.rotation.z += Math.sin(time * 14) * wobbleAmp;

      // idle sway
      mug.rotation.y = Math.sin(time * 0.45) * 0.10;

      // steam update
      for (var j = 0; j < PC; j++) {
        sLife[j] += 0.006 * steamFactor;
        if (sLife[j] > 1) resetParticle(j);
        sPos[j*3]   += sVX[j];
        sPos[j*3+1] += 0.013 * steamFactor;
        sPos[j*3+2] += (Math.random() - 0.5) * 0.003;
      }
      steamGeo.attributes.position.needsUpdate = true;
      steamMat.opacity = 0.32 + Math.sin(time * 1.8) * 0.07 + (hovering ? 0.18 : 0);

      renderer.render(scene, camera);
    })();

    setTimeout(function () { wrap.style.opacity = '1'; }, 700);
  }

  // ── shared geometry helpers ──────────────────────────────────────────
  function mkBox(w, h, d, mat, x, y, z) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    if (x !== undefined) m.position.set(x || 0, y || 0, z || 0);
    return m;
  }

  function mkMesh(geo, mat, x, y, z, rx, ry, rz) {
    var m = new THREE.Mesh(geo, mat);
    if (x !== undefined) m.position.set(x, y, z);
    if (rx !== undefined) m.rotation.set(rx, ry, rz);
    return m;
  }
})();
