// Tactile portfolio boards with keyboard-first interactions.
const { useEffect, useMemo, useRef, useState } = React;

function useDraggable(ref, initialRot = 0) {
  useEffect(() => {
    if (window.innerWidth <= 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const threshold = 6;
    let armed = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let offX = 0;
    let offY = 0;

    const beginDrag = () => {
      dragging = true;
      el.dataset.wasDragged = "true";
      el.classList.add("dragging");
      const rect = el.getBoundingClientRect();
      el.style.width = `${rect.width}px`;
      el.style.minHeight = `${rect.height}px`;
      el.style.position = "absolute";
      el.style.left = `${rect.left + window.scrollX}px`;
      el.style.top = `${rect.top + window.scrollY}px`;
      el.style.margin = "0";
      el.style.transform = `rotate(${initialRot}deg)`;
      el.style.userSelect = "none";
      if (el.parentNode !== document.body) document.body.appendChild(el);
    };

    const onDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      if (event.target.closest("a,input,textarea,select")) return;
      armed = true;
      el.dataset.wasDragged = "false";
      startX = event.clientX;
      startY = event.clientY;
      const rect = el.getBoundingClientRect();
      offX = startX - rect.left;
      offY = startY - rect.top;
    };
    const onMove = (event) => {
      if (!armed) return;
      if (!dragging && Math.hypot(event.clientX - startX, event.clientY - startY) < threshold) return;
      if (!dragging) beginDrag();
      el.style.left = `${event.clientX - offX + window.scrollX}px`;
      el.style.top = `${event.clientY - offY + window.scrollY}px`;
      event.preventDefault();
    };
    const onUp = () => {
      armed = false;
      if (!dragging) return;
      dragging = false;
      el.classList.remove("dragging");
      el.style.userSelect = "";
      window.setTimeout(() => { el.dataset.wasDragged = "false"; }, 0);
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [ref, initialRot]);
}

function DraggableNote({ children, rot = 0, className = "", style = {}, ...rest }) {
  const ref = useRef(null);
  useDraggable(ref, rot);
  return (
    <div ref={ref} className={`note draggable ${className}`} style={{ "--rot": `${rot}deg`, ...style }} {...rest}>
      {children}
    </div>
  );
}

function useAccessibleDialog(onClose, initialFocusRef) {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    previousFocus.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      (initialFocusRef?.current || dialogRef.current)?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((el) => !el.hasAttribute("hidden") && el.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus.current && document.contains(previousFocus.current)) previousFocus.current.focus();
    };
  }, [onClose, initialFocusRef]);

  return dialogRef;
}

function RotatingHeroPhoto() {
  const photos = RK.heroPhotoOrder;
  const [index, setIndex] = useState(0);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return undefined;
    const id = window.setInterval(() => setIndex((value) => (value + 1) % photos.length), 4000);
    return () => window.clearInterval(id);
  }, [photos.length, reduced]);

  const photo = photos[index];
  return (
    <div>
      <div className="hero-photo-stack">
        <div className="hero-photo-layer active">
          <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} />
        </div>
      </div>
      <div className="photo-dots" aria-hidden="true">
        {photos.map((_, photoIndex) => <span key={photoIndex} className={photoIndex === index ? "active" : ""} />)}
      </div>
    </div>
  );
}

function SocialsModal({ onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useAccessibleDialog(onClose, closeRef);
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className="note sky no-tape compact-dialog" role="dialog" aria-modal="true" aria-labelledby="socials-title" tabIndex="-1">
        <button ref={closeRef} className="dialog-close" onClick={onClose} aria-label="Close social links">×</button>
        <div className="mono eyebrow">find me online</div>
        <h2 id="socials-title" className="scribble dialog-title">The public trail.</h2>
        <p>Source, work history, and the easiest way to start a conversation.</p>
        <div className="social-link-grid">
          <a href={RK.github} target="_blank" rel="noopener noreferrer"><Icon name="github-logo" /> GitHub</a>
          <a href={RK.linkedin} target="_blank" rel="noopener noreferrer"><Icon name="linkedin-logo" /> LinkedIn</a>
          <a href={`mailto:${RK.email}`}><Icon name="envelope" /> Email</a>
        </div>
      </div>
    </div>
  );
}

function ResumeChooser({ onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useAccessibleDialog(onClose, closeRef);
  return (
    <div className="dialog-backdrop resume-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className="resume-chooser note yellow no-tape" role="dialog" aria-modal="true" aria-labelledby="resume-title" aria-describedby="resume-description" tabIndex="-1">
        <button ref={closeRef} className="dialog-close" onClick={onClose} aria-label="Close resume chooser">×</button>
        <div className="mono eyebrow">choose your evidence lens</div>
        <h2 id="resume-title" className="scribble dialog-title">Which résumé fits?</h2>
        <p id="resume-description">All four are one-page PDFs. The targeted versions keep the original visual system and emphasize different engineering work.</p>
        <div className="resume-option-grid">
          {RK.resumeOptions.map((option, index) => (
            <a key={option.id} data-resume-option={option.id} className={["resume-option", "yellow", "mint", "sky", "peach"][index]} href={encodeURI(option.file)} download={option.file.split("/").pop()} onClick={onClose}>
              <span className="resume-option-number mono">0{index + 1}</span>
              <span><strong>{option.label}</strong><small>{option.note}</small></span>
              <Icon name="download-simple" size={22} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeBoard() {
  const [showSocials, setShowSocials] = useState(false);
  const [showResume, setShowResume] = useState(false);
  return (
    <section className="board board-wrap" data-screen-label="01 Home" id="board-home">
      <div className="hero-shell">
        <div className="hero-grid">
          <div className="hero-text-col">
            <div className="scribble hero-kicker">hello, world - I am</div>
            <h1>Raminda <br /><span className="scribble-u">Kariyawasam</span>.</h1>
            <p className="hero-thesis">{RK.heroThesis}</p>
            <p className="hero-support">{RK.heroSupport}</p>
            <div className="hero-actions">
              <button className="btn" onClick={() => window.gotoBoard("nsbm")}><Icon name="circuitry" size="1em" /> engineering evidence</button>
              <button className="btn pink" onClick={() => window.gotoBoard("contact")}><Icon name="hand-waving" size="1em" /> say hi</button>
              <button className="btn sky" onClick={() => setShowSocials(true)}><Icon name="share-network" size="1em" /> public links</button>
              <button className="btn mint" onClick={() => setShowResume(true)}><Icon name="file-text" size="1em" /> choose a résumé</button>
            </div>
            <div className="hero-instruction"><Squiggle w={90} /><span className="mono">scroll · drag notes on wide screens · open the evidence</span></div>
          </div>
          <div className="polaroid-wrap">
            <div className="polaroid">
              <span className="tape-strip" aria-hidden="true" />
              <RotatingHeroPhoto />
              <div className="scribble polaroid-caption">that's me <Icon name="hand-peace" size="0.95em" /></div>
            </div>
          </div>
        </div>

        <div className="hero-float-notes" aria-label="Professional focus notes">
          <DraggableNote rot={-3} className="mint pin hero-note">
            <div className="scribble note-label">currently</div>
            <div>Associate Software Engineer</div>
            <div className="mono note-meta">// NSBM Green University</div>
          </DraggableNote>
          <DraggableNote rot={2} className="pink hero-note">
            <div className="scribble note-label">systems, not demos</div>
            <div>identity · data · AI controls · deployment · operations</div>
          </DraggableNote>
          <DraggableNote rot={-2} className="sky pin hero-note">
            <div className="scribble note-label">BSc (Hons)</div>
            <div>Software Engineering<br />Plymouth · 2025</div>
          </DraggableNote>
        </div>
        <Sparkle style={{ position: "absolute", left: "2%", top: "5%" }} />
      </div>
      {showResume && <ResumeChooser onClose={() => setShowResume(false)} />}
      {showSocials && <SocialsModal onClose={() => setShowSocials(false)} />}
    </section>
  );
}

function AboutBoard() {
  return (
    <section className="board board-wrap" data-screen-label="02 About" id="board-about">
      <div className="section-shell">
        <div className="section-head"><div className="num">02</div><h2>About the engineer.</h2></div>
        <div className="about-grid">
          <div>
            <DraggableNote rot={-1.5} className="yellow no-tape about-note">
              {RK.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </DraggableNote>
            <h3 className="scribble subhead">working principles</h3>
            <ul className="fact-list">
              {RK.quickFacts.map((fact) => <li key={fact}><Icon name="sparkle" size={15} /><span>{fact}</span></li>)}
            </ul>
          </div>
          <div>
            <div className="graduation-polaroid">
              <img src="assets/photo-grad.png" width="408" height="612" alt="Raminda Kariyawasam at the University of Plymouth graduation ceremony in 2025" />
              <div className="scribble">Plymouth, 2025 <Icon name="graduation-cap" size="0.95em" /></div>
            </div>
            <h3 className="scribble subhead">life so far</h3>
            <div className="timeline">
              {RK.timeline.map((item, index) => (
                <div className="timeline-item" key={`${item.year}-${item.title}`}>
                  <span className={`timeline-dot ${["yellow", "pink", "mint", "sky", "lav"][index % 5]}`} aria-hidden="true" />
                  <div className="mono timeline-year">{item.year}</div>
                  <strong>{item.title}</strong>
                  <div className="timeline-place">{item.place}</div>
                  {item.body && <p>{item.body}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailList({ title, items, icon = "pencil-simple" }) {
  if (!items || !items.length) return null;
  return (
    <section className="modal-detail-section">
      <h4 className="mono">{title}</h4>
      <ul>{items.map((item) => <li key={item}><Icon name={icon} size={14} aria-hidden="true" /><span>{item}</span></li>)}</ul>
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useAccessibleDialog(onClose, closeRef);
  const labels = project.categories
    .filter((id) => id !== "featured")
    .map((id) => RK.projectCategories.find((category) => category.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article ref={dialogRef} className={`note no-tape ${project.color} project-dialog`} role="dialog" aria-modal="true" aria-labelledby={`project-title-${project.id}`} aria-describedby={`project-summary-${project.id}`} tabIndex="-1">
        <button ref={closeRef} className="dialog-close" onClick={onClose} aria-label={`Close ${project.name} details`}>×</button>
        <header className="project-dialog-header">
          <Icon name={project.icon} size={42} aria-hidden="true" />
          <div>
            <div className="mono eyebrow">{project.status}</div>
            <h2 id={`project-title-${project.id}`} className="scribble dialog-title">{project.name}</h2>
            <p className="mono project-tagline">{project.tagline}</p>
          </div>
        </header>
        <div className="project-meta"><strong>{project.role}</strong><span>{project.organization}</span><span>{project.period}</span></div>
        <p id={`project-summary-${project.id}`} className="project-summary">{project.summary}</p>
        <div className="modal-chip-row">{labels.map((label) => <span className="chip" key={label}>{label}</span>)}</div>
        <section className="architecture-strip" aria-label="Architecture flow">
          {project.architecture.map((stage, index) => (
            <React.Fragment key={stage}>
              <div><span className="mono">0{index + 1}</span>{stage}</div>
              {index < project.architecture.length - 1 && <Icon name="arrow-right" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </section>
        <div className="modal-detail-grid">
          <DetailList title="Hard problems" items={project.hardProblems} icon="wrench" />
          <DetailList title="Implemented capabilities" items={project.features} icon="check-circle" />
          <DetailList title="Security boundaries" items={project.security} icon="shield-check" />
          <DetailList title="Operations" items={project.operations} icon="activity" />
        </div>
        <section className="modal-stack"><h4 className="mono">Stack</h4><div>{project.stack.map((item) => <span className="chip" key={item}>{item}</span>)}</div></section>
        {!!project.links.length && (
          <div className="project-links">{project.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"><Icon name="github-logo" /> {link.label}</a>)}</div>
        )}
      </article>
    </div>
  );
}

function FeaturedEngineeringBoard() {
  const [selected, setSelected] = useState(null);
  const featured = RK.projects.filter((project) => project.featured);
  return (
    <section className="board board-wrap evidence-board" data-screen-label="03 Evidence" id="board-nsbm">
      <div className="section-shell wide-shell">
        <div className="section-head"><div className="num">03</div><h2>Engineering evidence.</h2></div>
        <p className="section-intro">Four case studies, each organized around the problem, the system boundary, and what the implementation had to protect. Private code stays private; the technical story does not have to be vague.</p>
        <div className="featured-grid">
          {featured.map((project, index) => (
            <article className={`featured-case note no-tape ${project.color}`} key={project.id}>
              <header><span className="mono case-number">CASE 0{index + 1}</span><span className="status-stamp">{project.status}</span></header>
              <div className="featured-title-row"><Icon name={project.icon} size={34} aria-hidden="true" /><div><h3 className="scribble">{project.name}</h3><p className="mono">{project.tagline}</p></div></div>
              <p>{project.summary}</p>
              <div className="case-lane" aria-label={`${project.name} architecture`}>
                {project.architecture.map((stage) => <span key={stage}>{stage}</span>)}
              </div>
              <div className="case-capabilities">{project.capabilities.map((item) => <span className="chip" key={item}>{item}</span>)}</div>
              <button className="case-open" onClick={() => setSelected(project)} aria-haspopup="dialog">inspect the evidence <Icon name="arrow-up-right" /></button>
            </article>
          ))}
        </div>
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ProjectCard({ project, index, onOpen }) {
  const downPosition = useRef(null);
  const rotations = [-3, 2, -2, 3, -4, 1, -1, 4];
  const rot = rotations[index % rotations.length];
  const open = () => onOpen(project);
  const onClick = (event) => {
    if (event.currentTarget.dataset.wasDragged === "true") return;
    const down = downPosition.current;
    if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6) return;
    open();
  };
  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  };
  return (
    <DraggableNote rot={rot} className={`${project.color} project-card`} role="button" tabIndex="0" aria-haspopup="dialog" aria-label={`Open details for ${project.name}`} onPointerDown={(event) => { downPosition.current = { x: event.clientX, y: event.clientY }; }} onClick={onClick} onKeyDown={onKeyDown}>
      <header><Icon name={project.icon} size={30} aria-hidden="true" /><span className="mono">#{String(index + 1).padStart(2, "0")}</span></header>
      <h3 className="scribble">{project.name}</h3>
      <div className="mono project-card-tag">{project.tagline}</div>
      <p>{project.summary}</p>
      <div className="project-card-footer">
        <span className="status-stamp">{project.status}</span>
        <div>{project.stack.slice(0, 4).map((item) => <span className="chip" key={item}>{item}</span>)}</div>
        <span className="mono open-hint">open details →</span>
      </div>
    </DraggableNote>
  );
}

function ProjectsBoard() {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const counts = useMemo(() => {
    const result = { all: RK.projects.length };
    RK.projectCategories.slice(1).forEach((item) => { result[item.id] = RK.projects.filter((project) => project.categories.includes(item.id)).length; });
    return result;
  }, []);
  const visible = RK.projects.filter((project) => category === "all" || project.categories.includes(category));

  return (
    <section className="board board-wrap" data-screen-label="04 Work" id="board-work">
      <div className="section-shell wide-shell">
        <div className="section-head"><div className="num">04</div><h2>Complete project board.</h2></div>
        <p className="section-intro">Verified implementations, prototypes, and platform foundations. Use the filters to follow a technical thread; every project appears once in the catalogue.</p>
        <div className="project-filter" role="group" aria-label="Filter projects">
          {RK.projectCategories.map((item) => {
            const active = category === item.id;
            return <button key={item.id} className={active ? "active" : ""} aria-pressed={active} onClick={() => setCategory(item.id)}>{item.label} <span>({counts[item.id] || 0})</span></button>;
          })}
        </div>
        <p className="sr-only" role="status" aria-live="polite">Showing {visible.length} projects for {RK.projectCategories.find((item) => item.id === category)?.label}</p>
        <div className="project-grid">{visible.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={setSelected} />)}</div>
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ToolkitBoard() {
  const operatingNotes = [
    { title: "trace the boundary", body: "Identity, authorization, validation, and data ownership get named before the happy path.", color: "yellow" },
    { title: "make failure legible", body: "Conflicts, retries, audit state, and operator actions deserve first-class interfaces.", color: "mint" },
    { title: "measure the expensive bit", body: "AI usage, database access, solver work, and delivery paths need useful signals.", color: "pink" },
    { title: "ship the handover", body: "Migrations, deployment notes, tests, and recovery behavior are part of the feature.", color: "sky" }
  ];
  return (
    <section className="board board-wrap" data-screen-label="05 Toolkit" id="board-toolkit">
      <div className="section-shell">
        <div className="section-head"><div className="num">05</div><h2>Toolkit & operating habits.</h2></div>
        <p className="section-intro">Breadth is useful when it helps connect the product surface to its runtime reality.</p>
        <div className="toolkit-grid">
          {Object.entries(RK.skills).map(([group, items], index) => (
            <DraggableNote key={group} rot={index % 2 ? 1.5 : -1.5} className={["yellow", "pink", "mint", "sky", "lav"][index % 5]}>
              <h3 className="scribble">{group}</h3><div>{items.map((item) => <span className="chip" key={item}>{item}</span>)}</div>
            </DraggableNote>
          ))}
        </div>
        <h3 className="scribble subhead">how I keep systems honest</h3>
        <div className="operating-grid">{operatingNotes.map((note, index) => <DraggableNote key={note.title} rot={index % 2 ? 1 : -2} className={`${note.color} no-tape`}><div className="mono eyebrow">// {note.title}</div><p>{note.body}</p></DraggableNote>)}</div>
      </div>
    </section>
  );
}

function ContactBoard() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const send = () => {
    const mailSubject = encodeURIComponent(subject || `Hello from ${name || "a visitor"}`);
    const body = encodeURIComponent(`Hi Raminda,\n\n${message}\n\n- ${name}`);
    window.location.href = `mailto:${RK.email}?subject=${mailSubject}&body=${body}`;
  };
  return (
    <section className="board board-wrap" data-screen-label="06 Contact" id="board-contact">
      <div className="section-shell">
        <div className="section-head"><div className="num">06</div><h2>Let's talk. <Icon name="mailbox" size="0.8em" /></h2></div>
        <p className="section-intro">Send a concrete problem, a role, or a system that needs untangling.</p>
        <div className="contact-grid">
          <form className="note yellow contact-note" onSubmit={(event) => { event.preventDefault(); send(); }}>
            <div className="scribble contact-greeting">Dear Raminda,</div>
            <label htmlFor="contact-name">My name is</label><input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="your name" />
            <label htmlFor="contact-subject">Regarding</label><input id="contact-subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="a project, role, or technical problem" />
            <label htmlFor="contact-message">A note</label><textarea id="contact-message" value={message} onChange={(event) => setMessage(event.target.value)} rows="6" placeholder="write your message here" />
            <button className="btn pink" type="submit"><Icon name="paper-plane-tilt" size="1em" /> open in email</button>
          </form>
          <div className="contact-links">
            <a className="note mint" href={`mailto:${RK.email}`}><span className="mono">// email</span><strong>{RK.email}</strong></a>
            <a className="note sky" href={RK.linkedin} target="_blank" rel="noopener noreferrer"><span className="mono">// linkedin</span><strong>/in/raminda-dulmin</strong></a>
            <a className="note pink" href={RK.github} target="_blank" rel="noopener noreferrer"><span className="mono">// github</span><strong>{RK.handle}</strong></a>
            <div className="note lav"><span className="mono">// based in</span><strong>{RK.location}</strong><span className="mono second-label">// phone</span><a href="tel:+94758702922">{RK.phone}</a></div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomeBoard, AboutBoard, FeaturedEngineeringBoard, ProjectsBoard, ProjectCard, ProjectModal, ToolkitBoard, ContactBoard });
