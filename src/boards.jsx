// Board sections: Home, About, Work, NSBM, Toolkit, Contact
const { useEffect, useState, useRef } = React;

// Drag helper — makes any note draggable on a transient layer. Resets on reload.
function useDraggable(ref, initialRot = 0) {
  useEffect(() => {
    if (window.innerWidth <= 768) return;
    const el = ref.current;
    if (!el) return;
    let offX = 0, offY = 0;
    let dragging = false;
    let placeholder = null;
    const onDown = (e) => {
      if (e.target.closest('a,button,input,textarea,select')) return;
      dragging = true;
      el.classList.add('dragging');
      const rect = el.getBoundingClientRect();
      const startX = (e.clientX ?? e.touches?.[0]?.clientX);
      const startY = (e.clientY ?? e.touches?.[0]?.clientY);
      offX = startX - rect.left;
      offY = startY - rect.top;
      // Lock dimensions before reparenting so grid/flex sizing is preserved
      el.style.width = rect.width + 'px';
      el.style.height = rect.height + 'px';
      // Use absolute positioning within document so it scrolls with the page
      const pageX = rect.left + window.scrollX;
      const pageY = rect.top + window.scrollY;
      el.style.position = 'absolute';
      el.style.left = pageX + 'px';
      el.style.top = pageY + 'px';
      el.style.margin = '0';
      el.style.transform = `rotate(${initialRot}deg)`;
      // move to body so it can roam freely
      if (el.parentNode !== document.body) {
        document.body.appendChild(el);
      }
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const x = (e.clientX ?? e.touches?.[0]?.clientX);
      const y = (e.clientY ?? e.touches?.[0]?.clientY);
      el.style.left = (x - offX + window.scrollX) + 'px';
      el.style.top  = (y - offY + window.scrollY) + 'px';
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [ref, initialRot]);
}

function DraggableNote({ children, rot = 0, className = "", style = {}, ...rest }) {
  const ref = useRef(null);
  useDraggable(ref, rot);
  return (
    <div ref={ref} className={`note draggable ${className}`} style={{"--rot": `${rot}deg`, ...style}} {...rest}>
      {children}
    </div>
  );
}

// Rotating hero photo with varied animations
function RotatingHeroPhoto() {
  const photos = RK.heroPhotoOrder;
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(null);
  const animRef = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => {
        setPrev(i);
        animRef.current = (animRef.current + 1) % 4;
        return (i + 1) % photos.length;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [photos.length]);

  return (
    <div>
      <div className="hero-photo-stack">
        {photos.map((src, i) => {
          const isActive = i === idx;
          const isLeaving = i === prev && prev !== idx;
          const animIdx = animRef.current;
          let cls = "hero-photo-layer anim-" + animIdx;
          if (isActive) cls += " active";
          else if (isLeaving) cls += " leaving";
          return (
            <div key={i} className={cls}>
              <img src={src} alt={[
                "Raminda Kariyawasam in a suit, posing — professional headshot",
                "Raminda Kariyawasam at University of Plymouth graduation ceremony, 2025",
                "Raminda Kariyawasam in a suit",
                "Raminda Kariyawasam holding degree certificate"
              ][i] || `Raminda Kariyawasam — photo ${i + 1}`} />
            </div>
          );
        })}
      </div>
      <div className="photo-dots">
        {photos.map((_, i) => <span key={i} className={i===idx?"active":""}/>)}
      </div>
    </div>
  );
}

// ---------- HOME ----------
function HomeBoard() {
  return (
    <section className="board board-wrap" data-screen-label="01 Home" id="board-home">
      <div style={{position:"relative", maxWidth: 1280, margin: "0 auto", minHeight: "70vh", padding: "0 12px"}}>
        <div className="hero-grid" style={{display:"grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start"}}>

        <div className="hero-text-col" style={{position:"relative", zIndex: 3, maxWidth: 560, paddingTop: 12, paddingLeft: "clamp(0px, 4vw, 40px)"}}>
          <div className="scribble" style={{fontSize: "1.3rem", color: "var(--ink-soft)", transform:"rotate(-3deg)", display:"inline-block"}}>
            hello, world — my name is
          </div>
          <h1 style={{marginTop: 10}}>
            Raminda <br/>
            <span className="scribble-u">Kariyawasam</span>.
          </h1>
          <p style={{fontSize: "1.35rem", marginTop: 18, maxWidth: 520}}>
            I'm an <b>Associate Software Engineer</b> at NSBM Green University. I build <span style={{background:"var(--note-yellow)", color:"var(--note-ink)", padding:"0 6px", borderRadius:4}}>Awsome</span> full-stack products — web, mobile, a little 3D.
          </p>
          <div style={{display:"flex", gap:14, flexWrap:"wrap", marginTop: 24}}>
            <button className="btn" onClick={() => window.gotoBoard('work')}>📎 see my work →</button>
            <button className="btn pink" onClick={() => window.gotoBoard('contact')}>✉️ say hi</button>
          </div>

          <div style={{marginTop: 40, display: "flex", gap: 18, alignItems: "center", flexWrap:"wrap"}}>
            <Squiggle w={90} />
            <div className="mono" style={{fontSize: 14, color: "var(--ink-soft)"}}>scroll · drag the notes · poke around</div>
          </div>
        </div>

        <div className="polaroid-wrap" style={{
          width: "min(320px, 32vw)", zIndex: 2
        }}>
          <div style={{
            background: "var(--paper-2)",
            border: "2px solid var(--line)",
            padding: "18px 18px 54px",
            boxShadow: "10px 10px 0 var(--shadow)",
            transform: "rotate(4deg)",
            position: "relative"
          }}>
            <div style={{
              position: "absolute", top: -16, left: "50%", transform: "translateX(-50%) rotate(-6deg)",
              width: 110, height: 26, background: "var(--tape)",
              borderLeft: "1px dashed var(--tape-edge)", borderRight: "1px dashed var(--tape-edge)"
            }}/>
            <RotatingHeroPhoto />
            <div className="scribble" style={{fontSize:"1.5rem", textAlign:"center", marginTop: 6}}>
              that's me ✌️
            </div>
          </div>
        </div>
        </div>{/* /hero-grid */}

        <div className="hero-float-notes" style={{position:"relative", marginTop: 60, minHeight: 240}}>
          <DraggableNote rot={-4} className="mint pin" style={{position:"absolute", left:"2%", top: 20, width: 220}}>
            <div className="scribble" style={{fontSize: "1.3rem"}}>currently</div>
            <div style={{fontSize:18}}>Developing Awsome full-stack products</div>
            <div className="mono" style={{fontSize:13, marginTop:6, opacity:.75}}>// @NSBM_Green_University</div>
          </DraggableNote>

          <DraggableNote rot={3} className="pink" style={{position:"absolute", left:"28%", top: 40, width: 220}}>
            <div className="scribble" style={{fontSize:"1.2rem"}}>stack du jour</div>
            <div style={{fontSize:16, lineHeight:1.3}}>React · Three.js · Node · Flutter · Docker</div>
          </DraggableNote>

          <DraggableNote rot={-2} className="sky pin" style={{position:"absolute", left:"54%", top: 15, width: 190}}>
            <div style={{textAlign:"center"}}>
              <div className="scribble" style={{fontSize:"1.4rem"}}>BSc Hons Software Engineering</div>
              <div>Plymouth · 2025</div>
            </div>
          </DraggableNote>
        </div>

        <Sparkle style={{position:"absolute", left: "2%", top: "5%"}}/>
      </div>

      <div style={{maxWidth: 1280, margin: "60px auto 0", padding: "0 12px", display:"grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"}}>
        {[
          {k: "4+", v: "years building", c: "yellow"},
          {k: "45+", v: "shipped projects", c: "mint"},
          {k: "∞", v: "cups of coffee", c: "pink"},
          {k: "1", v: "very good dev", c: "sky"}
        ].map((s,i)=>(
          <DraggableNote rot={(i%2?1:-1)*2} key={i} className={`${s.c} no-tape`} style={{textAlign:"center"}}>
            <div className="scribble" style={{fontSize:"3rem", lineHeight:1}}>{s.k}</div>
            <div style={{fontSize:18}}>{s.v}</div>
          </DraggableNote>
        ))}
      </div>
    </section>
  );
}

// ---------- ABOUT ----------
function AboutBoard() {
  return (
    <section className="board board-wrap" data-screen-label="02 About" id="board-about">
      <div style={{maxWidth: 1200, margin: "0 auto"}}>
        <div className="section-head">
          <div className="num">02</div>
          <h2>About the guy ↓</h2>
        </div>
        <div className="grid cols-2" style={{marginTop: 20, alignItems:"start"}}>
          <div>
            <DraggableNote rot={-1.5} className="yellow no-tape" style={{maxWidth: 560}}>
              {RK.about.map((p, i) => (
                <p key={i} style={{fontSize: "1.1rem", marginTop: i===0?0:12}}>{p}</p>
              ))}
            </DraggableNote>

            <div style={{marginTop: 30}}>
              <h3 className="scribble" style={{fontSize:"2rem"}}>quick facts</h3>
              <ul style={{listStyle:"none", padding:0, margin:0}}>
                {RK.quickFacts.map((f, i) => (
                  <li key={i} style={{fontSize:"1.1rem", margin:"6px 0", display:"flex", gap:10}}>
                    <span>✦</span><span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div style={{display:"flex", justifyContent:"center", marginBottom: 20}}>
              <div style={{
                background: "var(--paper-2)", border: "2px solid var(--line)",
                padding: "14px 14px 36px", boxShadow: "8px 8px 0 var(--shadow)",
                transform: "rotate(-3deg)", width: 240
              }}>
                <div style={{
                  aspectRatio: "3/4",
                  background: `repeating-linear-gradient(135deg, var(--cork) 0 12px, var(--paper) 12px 24px)`,
                  border: "1px solid var(--line)",
                  display:"flex", alignItems:"flex-end", justifyContent:"center"
                }}>
                  <img src="assets/photo-grad.png" alt="Raminda Kariyawasam at University of Plymouth graduation ceremony, 2025" style={{maxWidth:"100%", maxHeight:"100%", objectFit:"contain"}}/>
                </div>
                <div className="scribble" style={{fontSize:"1.3rem", textAlign:"center", marginTop: 6, color:"var(--ink)"}}>
                  Plymouth, 2025 🎓
                </div>
              </div>
            </div>

            <h3 className="scribble" style={{fontSize:"2rem"}}>life so far</h3>
            <div style={{position:"relative", paddingLeft: 24}}>
              <div style={{position:"absolute", left: 6, top: 10, bottom: 10, width: 2, background: "var(--ink-soft)", borderRadius: 2}}/>
              {RK.timeline.map((t, i) => (
                <div key={i} style={{position:"relative", marginBottom: 22}}>
                  <div style={{
                    position:"absolute", left: -24, top: 8, width: 14, height: 14,
                    borderRadius:"50%", background: ["var(--note-yellow)","var(--note-pink)","var(--note-mint)","var(--note-sky)","var(--note-lav)"][i%5],
                    border: "2px solid var(--line)"
                  }}/>
                  <div className="mono" style={{fontSize:13, color:"var(--ink-soft)"}}>{t.year}</div>
                  <div style={{fontSize:"1.2rem", fontWeight:"bold"}}>{t.title}</div>
                  <div style={{fontSize:"1rem", color:"var(--ink-soft)"}}>{t.place}</div>
                  {t.body && <div style={{fontSize:"1rem", marginTop: 2}}>{t.body}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- WORK (featured) ----------
function WorkBoard() {
  return (
    <section className="board board-wrap" data-screen-label="03 Work" id="board-work">
      <div style={{maxWidth: 1280, margin: "0 auto"}}>
        <div className="section-head">
          <div className="num">03</div>
          <h2>Featured projects.</h2>
        </div>
        <p style={{fontSize:"1.1rem", maxWidth: 640}}>
          A tiny slice — drag the notes, click to open, or hop to <a href={RK.github} target="_blank" rel="noopener">GitHub</a>.
        </p>

        <div style={{marginTop: 36, display:"grid", gap: 30, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"}}>
          {RK.projects.map((p, i) => {
            const rot = [-3, 2, -2, 3, -4, 1, -1, 4][i % 8];
            return (
              <DraggableNote key={p.id} rot={rot} className={p.color} style={{minHeight: 220}}>
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                  <div style={{fontSize: 32}}>{p.icon}</div>
                  <div className="mono" style={{fontSize:12, opacity:.65}}>#{String(i+1).padStart(2,"0")}</div>
                </div>
                <h3 className="scribble" style={{fontSize:"1.8rem", marginTop: 8}}>{p.name}</h3>
                <div className="mono" style={{fontSize:12, opacity:.75, marginBottom: 6}}>{p.tag}</div>
                <p style={{fontSize:"1rem", margin: "8px 0 12px"}}>{p.body}</p>
                <div>
                  {p.stack.slice(0,4).map((s,j)=>(
                    <span className="chip" style={{"--chip-rot": `${(j%2?1:-1)}deg`}} key={j}>{s}</span>
                  ))}
                </div>
                {p.link && p.link !== "#" && (
                  <div style={{marginTop: 12}}>
                    <a href={p.link} target="_blank" rel="noopener" className="mono" style={{fontSize:13, color:"var(--note-ink)"}}>→ view on github</a>
                  </div>
                )}
              </DraggableNote>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- NSBM ORG PROJECTS ----------
function NsbmBoard() {
  return (
    <section className="board board-wrap" data-screen-label="04 NSBM" id="board-nsbm" style={{background:"linear-gradient(180deg, transparent, rgba(0,0,0,.03) 30%, transparent)"}}>
      <div style={{maxWidth: 1280, margin: "0 auto"}}>
        <div className="section-head">
          <div className="num">04</div>
          <h2>Projects at NSBM Green University</h2>
        </div>
        <p style={{fontSize:"1.1rem", maxWidth: 720}}>
          During my time on the NSBM dev team, I've contributed to <b>{RK.nsbmProjects.length}+</b> internal tools across portals, mobile, AI and operations. Here's the full lineup.
        </p>


        <div style={{marginTop: 40, display:"grid", gap: 22, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))"}}>
          {RK.nsbmProjects.map((p, i) => {
            const rot = [(-2), 1.5, -1, 2, -3, 1, -2, 3][i % 8];
            return (
              <DraggableNote key={p.name} rot={rot} className={`${p.color} no-tape`}>
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                  <div style={{fontSize: 28}}>{p.icon}</div>
                  <div className="mono" style={{fontSize:12, opacity:.7}}>{String(i+1).padStart(2,"0")}</div>
                </div>
                <h3 className="scribble" style={{fontSize:"1.6rem", marginTop: 6}}>{p.name}</h3>
                <p style={{fontSize:"0.98rem", margin: "6px 0 0", lineHeight: 1.4}}>{p.body}</p>
              </DraggableNote>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- TOOLKIT ----------
function ToolkitBoard() {
  return (
    <section className="board board-wrap" data-screen-label="05 Toolkit" id="board-toolkit">
      <div style={{maxWidth: 1200, margin: "0 auto"}}>
        <div className="section-head">
          <div className="num">05</div>
          <h2>My toolbox.</h2>
        </div>
        <p style={{maxWidth: 560, fontSize:"1.1rem"}}>What I reach for on Monday morning.</p>

        <div style={{marginTop: 30, display:"grid", gap: 22, gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"}}>
          {Object.entries(RK.skills).map(([group, items], i) => (
            <DraggableNote key={group} rot={(i%2?1.5:-1.5)} className={["yellow","pink","mint","sky","lav"][i%5]}>
              <h3 className="scribble" style={{fontSize:"1.8rem"}}>{group}</h3>
              <div>
                {items.map((it, j) => (
                  <span className="chip" key={j} style={{"--chip-rot": `${(j%3-1)}deg`}}>{it}</span>
                ))}
              </div>
            </DraggableNote>
          ))}
        </div>

        <div style={{marginTop: 50}}>
          <h3 className="scribble" style={{fontSize:"2rem"}}>a rough day-in-the-life</h3>
          <div style={{display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", marginTop: 14}}>
            {[
              {t:"morning",   v:"debug ✱ coffee ✱ standup", c:"yellow"},
              {t:"afternoon", v:"ship features · review PRs", c:"mint"},
              {t:"evening",   v:"side projects · learn things", c:"pink"},
              {t:"night",     v:"bug hunt · commit · sleep?", c:"sky"}
            ].map((b,i)=>(
              <DraggableNote rot={(i%2?1:-2)} key={i} className={`${b.c} no-tape`}>
                <div className="mono" style={{fontSize:12, opacity:.7}}>// {b.t}</div>
                <div style={{fontSize:"1.1rem", marginTop: 4}}>{b.v}</div>
              </DraggableNote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- CONTACT ----------
function ContactBoard() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const mailto = () => {
    const s = encodeURIComponent(subject || `Hello from ${name || "a friend"} 👋`);
    const b = encodeURIComponent(`Hi Raminda,\n\n${msg}\n\n— ${name}`);
    window.location.href = `mailto:${RK.email}?subject=${s}&body=${b}`;
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <section className="board board-wrap" data-screen-label="06 Contact" id="board-contact">
      <div style={{maxWidth: 1100, margin: "0 auto"}}>
        <div className="section-head">
          <div className="num">06</div>
          <h2>Let's talk. 📮</h2>
        </div>
        <p style={{maxWidth: 560, fontSize:"1.1rem"}}>Pin a note to my fridge. I reply — usually within a cup of coffee.</p>

        <div className="grid cols-2" style={{marginTop: 34, alignItems:"start"}}>
          <div className="note yellow" style={{"--rot":"-1.5deg", padding: "30px 30px 26px"}}>
            <div className="scribble" style={{fontSize:"1.5rem"}}>Dear Raminda,</div>
            <div style={{marginTop: 16}}>
              <label style={{display:"block", fontSize: 14, opacity:.7}}>my name is</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="your name"
                style={{width:"100%", background:"transparent", border:"none", borderBottom:"2px dashed var(--note-ink)",
                  fontFamily:"inherit", fontSize:"1.2rem", padding:"6px 2px", color:"var(--note-ink)", outline:"none"}}/>
            </div>
            <div style={{marginTop: 14}}>
              <label style={{display:"block", fontSize: 14, opacity:.7}}>re:</label>
              <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="project? coffee? 3am rant?"
                style={{width:"100%", background:"transparent", border:"none", borderBottom:"2px dashed var(--note-ink)",
                  fontFamily:"inherit", fontSize:"1.2rem", padding:"6px 2px", color:"var(--note-ink)", outline:"none"}}/>
            </div>
            <div style={{marginTop: 14}}>
              <label style={{display:"block", fontSize: 14, opacity:.7}}>a note</label>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={6} placeholder="write your message here..."
                style={{width:"100%", background:"transparent", border:"none", borderBottom:"2px dashed var(--note-ink)",
                  fontFamily:"inherit", fontSize:"1.1rem", padding:"6px 2px", color:"var(--note-ink)", outline:"none", resize:"vertical"}}/>
            </div>
            <div style={{display:"flex", gap: 12, alignItems:"center", marginTop: 18, flexWrap:"wrap"}}>
              <button className="btn pink" onClick={mailto} type="button">✉️ send to raminda</button>
              {sent && <span className="scribble" style={{fontSize:"1.3rem"}}>opening your mail app →</span>}
            </div>
            <div className="scribble" style={{marginTop: 18, fontSize: "1.3rem", textAlign:"right"}}>
              thanks a lot, ~
            </div>
          </div>

          <div style={{display:"grid", gap: 18}}>
            <a className="note mint" href={`mailto:${RK.email}`} style={{"--rot":"2deg", textDecoration:"none", display:"block"}}>
              <div className="mono" style={{fontSize:12, opacity:.7}}>// email</div>
              <div style={{fontSize:"1.3rem", marginTop: 2}}>{RK.email}</div>
            </a>
            <a className="note sky" href={RK.linkedin} target="_blank" rel="noopener" style={{"--rot":"-2deg", textDecoration:"none", display:"block"}}>
              <div className="mono" style={{fontSize:12, opacity:.7}}>// linkedin</div>
              <div style={{fontSize:"1.3rem", marginTop: 2}}>/in/raminda-dulmin</div>
            </a>
            <a className="note pink" href={RK.github} target="_blank" rel="noopener" style={{"--rot":"1.5deg", textDecoration:"none", display:"block"}}>
              <div className="mono" style={{fontSize:12, opacity:.7}}>// github</div>
              <div style={{fontSize:"1.3rem", marginTop: 2}}>{RK.handle}</div>
            </a>
            <div className="note lav" style={{"--rot":"-1deg"}}>
              <div className="mono" style={{fontSize:12, opacity:.7}}>// based in</div>
              <div style={{fontSize:"1.3rem", marginTop: 2}}>{RK.location}</div>
              <div className="mono" style={{fontSize:12, opacity:.7, marginTop: 10}}>// ring me</div>
              <div style={{fontSize:"1.2rem"}}>{RK.phone}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomeBoard, AboutBoard, WorkBoard, NsbmBoard, ToolkitBoard, ContactBoard });
