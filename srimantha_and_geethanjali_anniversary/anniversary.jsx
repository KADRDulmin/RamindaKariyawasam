import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import { animate, createTimeline, stagger } from "animejs";
import Swiper from "swiper";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/a11y";
import { ANNIVERSARY_EVENT as event } from "./event-config.mjs";
import {
  buildGoogleCalendarUrl,
  buildWhatsAppRsvpUrl,
  getCountdownState,
  validateRsvp,
} from "./invitation-utils.mjs";

const icons = {
  "arrow-up": <><path d="m6 15 6-6 6 6" /><path d="M12 9v11" /></>,
  calendar: <><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  external: <><path d="M14 5h5v5M19 5l-8 8" /><path d="M18 13v6H5V6h6" /></>,
  location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" /></>,
};

function Icon({ name }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">{icons[name]}</svg>;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function usePageMotion(reducedMotion) {
  useEffect(() => {
    const root = document.documentElement;
    const heroTargets = [
      ".hero-eyebrow",
      ".hero h1 > span",
      ".hero-headline",
      ".hero-details",
      ".hero-actions",
      ".jubilee-seal",
      ".hero-photo-caption",
    ];

    if (reducedMotion) {
      root.classList.remove("anime-ready");
      document.querySelectorAll(".reveal").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      return undefined;
    }

    root.classList.add("anime-ready");
    const animations = [];
    const timeline = createTimeline({ defaults: { ease: "outQuint" } })
      .add(".hero-eyebrow", { opacity: 1, translateY: 0, duration: 680 }, 100)
      .add(
        ".hero h1 > span",
        { opacity: 1, translateY: 0, duration: 920, delay: stagger(95) },
        180,
      )
      .add(".hero-headline", { opacity: 1, translateY: 0, duration: 760 }, 510)
      .add(".hero-details", { opacity: 1, translateY: 0, duration: 760 }, 600)
      .add(".hero-actions", { translateY: 0, duration: 760 }, 690)
      .add(
        ".jubilee-seal, .hero-photo-caption",
        { opacity: 1, duration: 900, delay: stagger(100) },
        760,
      );
    animations.push(timeline);

    const heroImage = document.querySelector(".hero-visual img");
    if (heroImage) {
      const reveal = animate(heroImage, {
        opacity: [0.58, 1],
        scale: [1.1, 1.045],
        duration: 1650,
        ease: "outQuint",
        onComplete: () => {
          const breathe = animate(heroImage, {
            scale: [1.045, 1.082],
            duration: 18000,
            ease: "inOutSine",
            loop: true,
            alternate: true,
          });
          animations.push(breathe);
        },
      });
      animations.push(reveal);
    }

    const revealElements = [...document.querySelectorAll(".reveal")];
    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            const isGallery = entry.target.classList.contains("gallery-item");
            const revealAnimation = animate(entry.target, {
              opacity: 1,
              translateY: 0,
              duration: isGallery ? 760 : 880,
              delay: isGallery
                ? Math.max(0, Number(entry.target.dataset.galleryIndex || 0) * 55)
                : 0,
              ease: "outQuint",
            });
            animations.push(revealAnimation);
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8%", threshold: 0.08 },
      );
      revealElements.forEach((element) => observer.observe(element));
    } else {
      revealElements.forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
    }

    const parallaxFrame = document.querySelector(".parallax-frame");
    const parallaxImage = parallaxFrame?.querySelector("img");
    let parallaxVisible = false;
    let parallaxFrameId = 0;
    let parallaxObserver;

    const updateParallax = () => {
      parallaxFrameId = 0;
      if (!parallaxVisible || !parallaxFrame || !parallaxImage || window.innerWidth <= 820) return;
      const bounds = parallaxFrame.getBoundingClientRect();
      const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
      const offset = (Math.min(1, Math.max(0, progress)) - 0.5) * 24;
      parallaxImage.style.transform = `scale(1.055) translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      if (parallaxVisible && !parallaxFrameId) {
        parallaxFrameId = window.requestAnimationFrame(updateParallax);
      }
    };

    if (parallaxFrame && parallaxImage && "IntersectionObserver" in window) {
      parallaxObserver = new IntersectionObserver(([entry]) => {
        parallaxVisible = Boolean(entry?.isIntersecting);
        if (parallaxVisible) updateParallax();
      }, { rootMargin: "20% 0px" });
      parallaxObserver.observe(parallaxFrame);
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      root.classList.remove("anime-ready");
      observer?.disconnect();
      parallaxObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (parallaxFrameId) window.cancelAnimationFrame(parallaxFrameId);
      animations.forEach((animation) => animation?.pause?.());
    };
  }, [reducedMotion]);
}

function useScrollChrome() {
  const headerRef = useRef(null);
  const progressRef = useRef(null);
  const backToTopRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      headerRef.current?.classList.toggle("is-scrolled", scrollTop > 28);
      backToTopRef.current?.classList.toggle("is-visible", scrollTop > 720);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(1, scrollTop / scrollable)})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { headerRef, progressRef, backToTopRef };
}

function getFocusableElements(container) {
  return [...container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )].filter((element) => !element.hidden && element.getClientRects().length > 0);
}

function useNativeDialog(dialogRef, open, initialFocusSelector) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) {
      dialog.showModal();
      const frame = window.requestAnimationFrame(() => {
        dialog.querySelector(initialFocusSelector)?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(frame);
    }
    if (!open && dialog.open) dialog.close();
    return undefined;
  }, [dialogRef, initialFocusSelector, open]);
}

function trapDialogFocus(eventObject) {
  if (eventObject.key !== "Tab") return;
  const focusable = getFocusableElements(eventObject.currentTarget);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (eventObject.shiftKey && document.activeElement === first) {
    eventObject.preventDefault();
    last.focus();
  } else if (!eventObject.shiftKey && document.activeElement === last) {
    eventObject.preventDefault();
    first.focus();
  }
}

function Hero({ onCalendar, onRsvp }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">A silver jubilee celebration</p>
        <h1 id="hero-title">
          <span>{event.couple.firstName}</span>
          <span className="ampersand">&amp;</span>
          <span>{event.couple.secondName}</span>
        </h1>
        <p className="hero-headline">{event.headline}</p>

        <div className="hero-details" aria-label="Celebration details">
          <div><Icon name="calendar" /><span>{event.dateLabel}</span></div>
          <div><Icon name="clock" /><span>{event.timeLabel}</span></div>
          <div><Icon name="location" /><span>{event.venue.name}</span></div>
        </div>

        <div className="hero-actions">
          <button className="button button-primary" type="button" data-calendar-open onClick={onCalendar}>
            <Icon name="calendar" />Save the Date
          </button>
          <button className="button button-ghost" type="button" data-rsvp-open onClick={onRsvp}>
            Confirm Attendance
          </button>
          <a className="text-link" href="#invitation">View Invitation <span aria-hidden="true">↓</span></a>
        </div>
      </div>

      <div className="hero-visual" aria-label={`Portrait of ${event.couple.displayName}`}>
        <picture>
          <source
            type="image/webp"
            srcSet="assets/images/hero-480.webp 480w, assets/images/hero-760.webp 760w, assets/images/hero-941.webp 941w"
            sizes="(max-width: 820px) 100vw, 62vw"
          />
          <img
            src="assets/images/hero-941.webp"
            width="941"
            height="706"
            alt="Srimantha and Geethanjali seated together beneath a tree, smiling at one another"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero-vignette" aria-hidden="true" />
        <div className="jubilee-seal" aria-label="25 years together">
          <span className="seal-number">25</span>
          <span className="seal-label">Years<br />Together</span>
        </div>
        <p className="hero-photo-caption">Twenty-five years, one beautiful story</p>
      </div>
    </section>
  );
}

function OpeningInvitation() {
  return (
    <section className="invitation-section section" id="invitation" aria-labelledby="invitation-title">
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="invitation-card reveal">
        <div className="corner corner-top-left" aria-hidden="true" />
        <div className="corner corner-top-right" aria-hidden="true" />
        <div className="corner corner-bottom-left" aria-hidden="true" />
        <div className="corner corner-bottom-right" aria-hidden="true" />
        <p className="eyebrow">Together, with joy</p>
        <div className="mini-monogram" aria-hidden="true">{event.couple.monogram}</div>
        <h2 id="invitation-title">A celebration written in silver</h2>
        <p className="invitation-message">{event.invitationMessage}</p>
        <div className="flourish" aria-hidden="true"><span /><i>25</i><span /></div>
        <p className="invitation-signature">{event.couple.displayName}</p>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="story-section section" id="story" aria-labelledby="story-title">
      <div className="section-shell">
        <div className="section-heading reveal">
          <p className="eyebrow">Twenty-five years together</p>
          <h2 id="story-title">A beautiful journey of love and togetherness</h2>
          <p>Celebrating the moments that brought us here.</p>
        </div>

        <div className="story-feature reveal">
          <figure className="story-feature-image parallax-frame">
            <picture>
              <source
                type="image/webp"
                srcSet="assets/images/memory-twilight-360.webp 360w, assets/images/memory-twilight-720.webp 720w, assets/images/memory-twilight-1080.webp 1080w"
                sizes="(max-width: 820px) 100vw, 52vw"
              />
              <img
                src="assets/images/memory-twilight-720.webp"
                width="720"
                height="1280"
                loading="lazy"
                decoding="async"
                alt="Srimantha and Geethanjali standing together beside the water under evening lights"
              />
            </picture>
            <figcaption>Side by side, through every season</figcaption>
          </figure>
          <div className="story-feature-copy">
            <span className="chapter-number" aria-hidden="true">25</span>
            <p className="story-kicker">A story shaped by togetherness</p>
            <blockquote>“Twenty-five years, countless memories, one beautiful story.”</blockquote>
            <p>
              This evening celebrates companionship, shared laughter, and the many moments—grand and quiet—that make a beautiful journey together.
            </p>
            <a className="text-link text-link-dark" href="#gallery">View Our Memories <span aria-hidden="true">→</span></a>
          </div>
        </div>

        <div className="memory-pair">
          <figure className="memory-card memory-card-one reveal">
            <picture>
              <source
                type="image/webp"
                srcSet="assets/images/memory-2017-360.webp 360w, assets/images/memory-2017-720.webp 720w, assets/images/memory-2017-1080.webp 1080w"
                sizes="(max-width: 820px) 88vw, 34vw"
              />
              <img
                src="assets/images/memory-2017-720.webp"
                width="720"
                height="960"
                loading="lazy"
                decoding="async"
                alt="A close indoor selfie of Srimantha and Geethanjali sitting side by side"
              />
            </picture>
            <figcaption><span>01</span> A quiet memory, held close</figcaption>
          </figure>
          <div className="memory-bridge reveal" aria-hidden="true"><span /><i>and</i><span /></div>
          <figure className="memory-card memory-card-two reveal">
            <picture>
              <source
                type="image/webp"
                srcSet="assets/images/memory-candid-360.webp 360w, assets/images/memory-candid-720.webp 720w, assets/images/memory-candid-1080.webp 1080w"
                sizes="(max-width: 820px) 88vw, 34vw"
              />
              <img
                src="assets/images/memory-candid-720.webp"
                width="720"
                height="960"
                loading="lazy"
                decoding="async"
                alt="A cheerful close selfie of Srimantha and Geethanjali while travelling"
              />
            </picture>
            <figcaption><span>02</span> Joy in the everyday</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function Countdown() {
  const [state, setState] = useState(() => getCountdownState());

  useEffect(() => {
    if (state.complete) return undefined;
    const timer = window.setInterval(() => {
      const next = getCountdownState();
      setState(next);
      if (next.complete) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state.complete]);

  const accessibleText = state.complete
    ? "The celebration has begun. Welcome to Srimantha and Geethanjali's special evening."
    : `${state.days} days, ${state.hours} hours, and ${state.minutes} minutes until the celebration.`;

  return (
    <div className="countdown-wrap reveal" aria-labelledby="countdown-title">
      <p className="eyebrow" id="countdown-title">Until we celebrate</p>
      {!state.complete ? (
        <div className="countdown" data-countdown aria-hidden="true">
          <div><strong data-days>{String(state.days).padStart(3, "0")}</strong><span>Days</span></div>
          <i aria-hidden="true">:</i>
          <div><strong data-hours>{String(state.hours).padStart(2, "0")}</strong><span>Hours</span></div>
          <i aria-hidden="true">:</i>
          <div><strong data-minutes>{String(state.minutes).padStart(2, "0")}</strong><span>Minutes</span></div>
          <i aria-hidden="true">:</i>
          <div><strong data-seconds>{String(state.seconds).padStart(2, "0")}</strong><span>Seconds</span></div>
        </div>
      ) : (
        <p className="countdown-complete" data-countdown-complete>
          The celebration has begun—welcome to our special evening.
        </p>
      )}
      <p className="countdown-accessible sr-only" data-countdown-accessible aria-live="polite">
        {accessibleText}
      </p>
    </div>
  );
}

function EventDetails({ onCalendar, onRsvp }) {
  return (
    <section className="details-section section" id="details" aria-labelledby="details-title">
      <div className="details-backdrop" aria-hidden="true" />
      <div className="section-shell details-shell">
        <div className="section-heading section-heading-light reveal">
          <p className="eyebrow">The celebration</p>
          <h2 id="details-title">We would love to celebrate with you</h2>
        </div>

        <div className="detail-layout">
          <div className="detail-list reveal">
            <article className="detail-item"><span className="detail-index">01</span><div><p>Date</p><h3>{event.dateLabel}</h3></div></article>
            <article className="detail-item"><span className="detail-index">02</span><div><p>Time</p><h3>{event.timeLabel}</h3><small>{event.timeZone}</small></div></article>
            <article className="detail-item"><span className="detail-index">03</span><div><p>Venue</p><h3>{event.venue.name}</h3><small>{event.venue.address}</small></div></article>
          </div>

          <div className="detail-emblem reveal" aria-label="Silver jubilee, 25 years together">
            <div className="emblem-ring emblem-ring-outer" />
            <div className="emblem-ring emblem-ring-inner" />
            <span className="emblem-small">Silver Jubilee</span>
            <strong>25</strong>
            <span className="emblem-years">Years Together</span>
            <span className="emblem-date">{event.couple.monogram} · Silver Jubilee</span>
          </div>

          <div className="detail-actions reveal">
            <button className="button button-light" type="button" data-calendar-open onClick={onCalendar}><Icon name="calendar" />Add to Calendar</button>
            <a className="button button-outline-light" href={event.venue.directionsUrl} target="_blank" rel="noopener noreferrer"><Icon name="location" />Get Directions</a>
            <button className="button button-outline-light" type="button" data-rsvp-open onClick={onRsvp}><Icon name="check" />Confirm Attendance</button>
          </div>
        </div>

        <Countdown />
      </div>
    </section>
  );
}

function Gallery({ onOpen }) {
  const classes = [
    "gallery-item-wide",
    "gallery-item-tall",
    "gallery-item-tall",
    "gallery-item-tall gallery-item-focus-low",
    "gallery-item-wide",
  ];

  return (
    <section className="gallery-section section" id="gallery" aria-labelledby="gallery-title">
      <div className="section-shell">
        <div className="gallery-heading reveal">
          <div><p className="eyebrow">Our photo story</p><h2 id="gallery-title">Moments we hold dear</h2></div>
          <p>Select any photograph to view it full screen. Use arrow keys or swipe to move through the story.</p>
        </div>
        <div className="gallery-grid" data-gallery>
          {event.gallery.map((image, index) => (
            <button
              className={`gallery-item ${classes[index]} reveal`}
              type="button"
              data-gallery-index={index}
              aria-haspopup="dialog"
              aria-label={`Open photo ${index + 1} of ${event.gallery.length}: ${image.caption}`}
              onClick={(eventObject) => onOpen(index, eventObject)}
              key={image.id}
            >
              <img
                src={image.thumb}
                width={index === 0 ? 480 : index === 4 ? 720 : 360}
                height={index === 0 ? 360 : index === 3 ? 640 : index === 4 ? 706 : 480}
                loading="lazy"
                decoding="async"
                alt={image.alt}
              />
              <span><b>{String(index + 1).padStart(2, "0")}</b><em>{image.caption}</em></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Venue({ showToast }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const loadMap = () => {
    setMapLoaded(true);
    showToast("Map loaded.");
  };

  return (
    <section className="venue-section section" id="venue" aria-labelledby="venue-title">
      <div className="section-shell venue-shell">
        <article className="venue-card reveal">
          <p className="eyebrow">Where to join us</p>
          <h2 id="venue-title">{event.venue.name}</h2>
          <p className="venue-address">{event.venue.address}</p>
          <div className="venue-rule" aria-hidden="true" />
          <p>A setting for an evening filled with warm company and beautiful memories.</p>
          <div className="venue-actions">
            <a className="button button-primary" href={event.venue.directionsUrl} target="_blank" rel="noopener noreferrer"><Icon name="location" />Get Directions</a>
            <a className="text-link text-link-dark" href={event.venue.website} target="_blank" rel="noopener noreferrer">Visit venue website <Icon name="external" /></a>
          </div>
          <p className="venue-verified"><Icon name="check" /> Address verified from the official venue website</p>
        </article>

        <div className="map-card reveal" data-map-card>
          {mapLoaded ? (
            <iframe
              title={`Map showing ${event.venue.name}`}
              src={event.venue.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="map-placeholder">
              <div className="map-orbit" aria-hidden="true"><span /><span /><span /></div>
              <Icon name="location" />
              <h3>View Monarch Imperial on the map</h3>
              <p>The map loads only when you choose to view it.</p>
              <button className="button button-outline-dark" type="button" data-map-load onClick={loadMap}>View Map</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RsvpCallout({ onRsvp }) {
  return (
    <section className="rsvp-section section" id="rsvp" aria-labelledby="rsvp-title">
      <div className="rsvp-light rsvp-light-one" aria-hidden="true" />
      <div className="rsvp-light rsvp-light-two" aria-hidden="true" />
      <div className="rsvp-content reveal">
        <div className="rsvp-monogram" aria-hidden="true"><span>{event.couple.monogram}</span><i>25</i></div>
        <p className="eyebrow">We hope you can join us</p>
        <h2 id="rsvp-title">Confirm Your Attendance</h2>
        <p>Please let us know whether you will be celebrating with us.</p>
        <button className="button button-light" type="button" data-rsvp-open onClick={onRsvp}><Icon name="check" />Confirm Attendance</button>
        <small>{event.rsvp.privacyNotice}</small>
      </div>
    </section>
  );
}

function Closing({ onRsvp, onShare }) {
  return (
    <section className="closing-section section" aria-labelledby="closing-title">
      <div className="closing-photo reveal">
        <picture>
          <source
            type="image/webp"
            srcSet="assets/images/memory-celebration-720.webp 720w, assets/images/memory-celebration-1200.webp 1200w, assets/images/memory-celebration-1764.webp 1764w"
            sizes="(max-width: 820px) 100vw, 56vw"
          />
          <img
            src="assets/images/memory-celebration-1200.webp"
            width="1200"
            height="1178"
            loading="lazy"
            decoding="async"
            alt="Srimantha holding awards beside Geethanjali with a bouquet at an awards celebration"
          />
        </picture>
      </div>
      <div className="closing-copy reveal">
        <p className="eyebrow">With love</p>
        <h2 id="closing-title">{event.closingMessage}</h2>
        <p className="closing-names">{event.couple.displayName}</p>
        <p>{event.shortDateLabel} <span aria-hidden="true">·</span> {event.venue.name}</p>
        <div className="closing-actions">
          <button className="button button-primary" type="button" data-rsvp-open onClick={onRsvp}>Confirm Attendance</button>
          <button className="text-link text-link-dark" type="button" data-share onClick={onShare}>Share Invitation <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </section>
  );
}

function CalendarDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  useNativeDialog(dialogRef, open, "[data-dialog-close]");

  return (
    <dialog
      className="form-dialog calendar-dialog"
      data-calendar-dialog
      aria-labelledby="calendar-dialog-title"
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={trapDialogFocus}
      onClick={(eventObject) => eventObject.target === dialogRef.current && onClose()}
    >
      <div className="form-dialog-shell">
        <button className="dialog-close" type="button" data-dialog-close aria-label="Close calendar options" onClick={onClose}><Icon name="close" /></button>
        <p className="eyebrow">Save the celebration</p>
        <h2 id="calendar-dialog-title">Add to Calendar</h2>
        <p>Choose the calendar you use. The event begins at {event.timeLabel} in {event.timeZone}.</p>
        <div className="calendar-options">
          <a className="calendar-option" href={buildGoogleCalendarUrl()} data-google-calendar target="_blank" rel="noopener noreferrer">
            <span className="calendar-option-icon">G</span>
            <span><strong>Google Calendar</strong><small>Open in a new tab</small></span>
            <Icon name="external" />
          </a>
          <a className="calendar-option" href={event.calendar.fileName} download>
            <span className="calendar-option-icon">.ics</span>
            <span><strong>Apple, Outlook &amp; others</strong><small>Download calendar event</small></span>
            <Icon name="calendar" />
          </a>
        </div>
        <p className="dialog-note">Because the invitation says “onwards,” no end time has been added.</p>
      </div>
    </dialog>
  );
}

function RsvpDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const lastPreparedSubmission = useRef({ fingerprint: "", preparedAt: 0 });
  const [attending, setAttending] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ message: "", type: "" });
  const [submitting, setSubmitting] = useState(false);
  useNativeDialog(dialogRef, open, "#guest-name");

  const errorProps = (name) => ({
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `rsvp-error-${name}` : undefined,
  });

  const submit = async (eventObject) => {
    eventObject.preventDefault();
    if (submitting) return;
    const formData = new FormData(formRef.current);
    const response = formData.get("attending") === "yes" ? "yes" : formData.get("attending") === "no" ? "no" : "";
    const values = {
      guestName: String(formData.get("guestName") || "").trim(),
      attending: response,
      guestCount: response === "no" ? 0 : Number(formData.get("guestCount")),
      contactNumber: String(formData.get("contactNumber") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      company: String(formData.get("company") || "").trim(),
    };

    const validationErrors = validateRsvp(values);
    setErrors(validationErrors);
    setStatus({ message: "", type: "" });
    if (Object.keys(validationErrors).length) {
      setStatus({ message: "Please review the highlighted fields.", type: "error" });
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }
    if (values.company) {
      setStatus({ message: "This RSVP could not be submitted.", type: "error" });
      return;
    }
    if (!event.rsvp.enabled || event.rsvp.channel !== "whatsapp" || !event.rsvp.whatsappNumber) {
      setStatus({ message: event.rsvp.unconfiguredMessage, type: "error" });
      return;
    }

    const fingerprint = JSON.stringify(values);
    const preparedAt = Date.now();
    if (
      fingerprint === lastPreparedSubmission.current.fingerprint &&
      preparedAt - lastPreparedSubmission.current.preparedAt < 2500
    ) {
      setStatus({
        message: "WhatsApp is already opening with this RSVP. Review the message there and tap Send to confirm.",
        type: "info",
      });
      return;
    }

    setSubmitting(true);
    try {
      const whatsappUrl = buildWhatsAppRsvpUrl(values);
      lastPreparedSubmission.current = { fingerprint, preparedAt };
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setStatus({
        message: "WhatsApp has opened with your RSVP. Review the message, then tap Send to confirm your attendance.",
        type: "info",
      });
    } catch {
      setStatus({ message: "We could not open WhatsApp. Please check your connection and try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog
      className="form-dialog rsvp-dialog"
      data-rsvp-dialog
      aria-labelledby="rsvp-dialog-title"
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={trapDialogFocus}
      onClick={(eventObject) => eventObject.target === dialogRef.current && onClose()}
    >
      <div className="form-dialog-shell rsvp-dialog-shell">
        <button className="dialog-close" type="button" data-dialog-close aria-label="Close attendance form" onClick={onClose}><Icon name="close" /></button>
        <p className="eyebrow">{event.shortDateLabel}</p>
        <h2 id="rsvp-dialog-title">Confirm Your Attendance</h2>
        <p className="dialog-intro">We would be delighted to celebrate with you.</p>

        <form data-rsvp-form noValidate ref={formRef} onSubmit={submit}>
          <div className="form-field form-field-full">
            <label htmlFor="guest-name">Guest name <span aria-hidden="true">*</span></label>
            <input id="guest-name" name="guestName" type="text" autoComplete="name" maxLength="100" required {...errorProps("guestName")} />
            <small className="field-error" id="rsvp-error-guestName" data-error-for="guestName">{errors.guestName}</small>
          </div>

          <fieldset className="form-field form-field-full attendance-field">
            <legend>Will you be attending? <span aria-hidden="true">*</span></legend>
            <div className="segmented-control">
              <label><input type="radio" name="attending" value="yes" required onChange={(eventObject) => setAttending(eventObject.target.value)} {...errorProps("attending")} /><span><Icon name="check" />Joyfully accepts</span></label>
              <label><input type="radio" name="attending" value="no" required onChange={(eventObject) => setAttending(eventObject.target.value)} {...errorProps("attending")} /><span>Regretfully declines</span></label>
            </div>
            <small className="field-error" id="rsvp-error-attending" data-error-for="attending">{errors.attending}</small>
          </fieldset>

          <div className="form-row">
            <div className="form-field" data-guest-count-field hidden={attending === "no"}>
              <label htmlFor="guest-count">Number of guests <span aria-hidden="true">*</span></label>
              <input id="guest-count" name="guestCount" type="number" inputMode="numeric" min="1" max="20" defaultValue="1" required={attending !== "no"} disabled={attending === "no"} {...errorProps("guestCount")} />
              <small>Including you</small>
              <small className="field-error" id="rsvp-error-guestCount" data-error-for="guestCount">{errors.guestCount}</small>
            </div>
            <div className="form-field">
              <label htmlFor="contact-number">Contact number <span aria-hidden="true">*</span></label>
              <input id="contact-number" name="contactNumber" type="tel" inputMode="tel" autoComplete="tel" maxLength="30" required {...errorProps("contactNumber")} />
              <small className="field-error" id="rsvp-error-contactNumber" data-error-for="contactNumber">{errors.contactNumber}</small>
            </div>
          </div>

          <div className="form-field form-field-full">
            <div className="label-row"><label htmlFor="guest-message">A message for the couple <span>(optional)</span></label><output htmlFor="guest-message" data-message-count>{messageLength} / 500</output></div>
            <textarea id="guest-message" name="message" rows="4" maxLength="500" onInput={(eventObject) => setMessageLength(eventObject.currentTarget.value.length)} {...errorProps("message")} />
            <small className="field-error" id="rsvp-error-message" data-error-for="message">{errors.message}</small>
          </div>

          <div className="honeypot" aria-hidden="true">
            <label htmlFor="company-name">Company</label>
            <input id="company-name" name="company" type="text" tabIndex="-1" autoComplete="off" />
          </div>

          <p className="form-privacy"><Icon name="check" />{event.rsvp.privacyNotice}</p>
          <p className={`form-status ${status.type ? `is-${status.type}` : ""}`} data-form-status role="status" aria-live="polite">{status.message}</p>
          <button className="button button-primary form-submit" type="submit" data-submit disabled={submitting} aria-busy={submitting}>
            <span data-submit-label>{submitting ? "Opening WhatsApp…" : "Continue in WhatsApp"}</span>
            {!submitting && <Icon name="external" />}
            <span className="button-spinner" data-submit-spinner hidden={!submitting} aria-hidden="true" />
          </button>
        </form>
      </div>
    </dialog>
  );
}

function Lightbox({ open, initialIndex, reducedMotion, onClose }) {
  const dialogRef = useRef(null);
  const swiperElementRef = useRef(null);
  const previousRef = useRef(null);
  const nextRef = useRef(null);
  const swiperInstanceRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  useNativeDialog(dialogRef, open, "[data-lightbox-close]");

  useEffect(() => {
    if (!open) return undefined;
    setCurrentIndex(initialIndex);
    const frame = window.requestAnimationFrame(() => {
      if (!swiperElementRef.current) return;
      swiperInstanceRef.current?.destroy(true, true);
      swiperInstanceRef.current = new Swiper(swiperElementRef.current, {
        modules: [Navigation, Keyboard, A11y],
        initialSlide: initialIndex,
        speed: reducedMotion ? 0 : 520,
        rewind: true,
        grabCursor: true,
        lazyPreloadPrevNext: 1,
        keyboard: { enabled: true, onlyInViewport: false, pageUpDown: false },
        navigation: { prevEl: previousRef.current, nextEl: nextRef.current },
        a11y: {
          enabled: true,
          containerMessage: "Anniversary photo viewer",
          itemRoleDescriptionMessage: "photograph",
          prevSlideMessage: "Previous photograph",
          nextSlideMessage: "Next photograph",
          slideLabelMessage: "{{index}} of {{slidesLength}}",
        },
        on: {
          slideChange(swiper) {
            setCurrentIndex(swiper.activeIndex);
          },
        },
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      swiperInstanceRef.current?.destroy(true, true);
      swiperInstanceRef.current = null;
    };
  }, [initialIndex, open, reducedMotion]);

  const current = event.gallery[currentIndex] || event.gallery[0];

  return (
    <dialog
      className="lightbox-dialog"
      data-lightbox
      aria-labelledby="lightbox-caption"
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={trapDialogFocus}
      onClick={(eventObject) => eventObject.target === dialogRef.current && onClose()}
    >
      <div className="lightbox-shell">
        <button className="dialog-close lightbox-close" type="button" data-lightbox-close aria-label="Close photo viewer" onClick={onClose}><Icon name="close" /></button>
        <button className="lightbox-control lightbox-previous" type="button" data-lightbox-previous aria-label="Previous photograph" ref={previousRef}><Icon name="chevron-left" /></button>
        <div className="lightbox-swiper swiper" ref={swiperElementRef}>
          <div className="swiper-wrapper">
            {event.gallery.map((image, index) => (
              <figure className="lightbox-figure swiper-slide" key={image.id}>
                <img
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes="90vw"
                  width={image.width}
                  height={image.height}
                  loading={index === initialIndex ? "eager" : "lazy"}
                  decoding="async"
                  alt={image.alt}
                />
              </figure>
            ))}
          </div>
          <div className="lightbox-caption" id="lightbox-caption" aria-live="polite">
            <span data-lightbox-caption>{current.caption}</span>
            <span data-lightbox-counter>{currentIndex + 1} / {event.gallery.length}</span>
          </div>
        </div>
        <button className="lightbox-control lightbox-next" type="button" data-lightbox-next aria-label="Next photograph" ref={nextRef}><Icon name="chevron-right" /></button>
      </div>
    </dialog>
  );
}

function App() {
  const reducedMotion = useReducedMotion();
  const { headerRef, progressRef, backToTopRef } = useScrollChrome();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [toast, setToast] = useState("");
  const calendarTrigger = useRef(null);
  const rsvpTrigger = useRef(null);
  const lightboxTrigger = useRef(null);
  const toastTimer = useRef(0);

  usePageMotion(reducedMotion);

  useEffect(() => {
    document.body.classList.toggle("dialog-open", calendarOpen || rsvpOpen || lightboxOpen);
    return () => document.body.classList.remove("dialog-open");
  }, [calendarOpen, lightboxOpen, rsvpOpen]);

  const showToast = useCallback((message) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 3200);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const openCalendar = useCallback((eventObject) => {
    calendarTrigger.current = eventObject?.currentTarget || document.activeElement;
    setCalendarOpen(true);
  }, []);
  const closeCalendar = useCallback(() => {
    setCalendarOpen(false);
    window.requestAnimationFrame(() => calendarTrigger.current?.focus?.({ preventScroll: true }));
  }, []);
  const openRsvp = useCallback((eventObject) => {
    rsvpTrigger.current = eventObject?.currentTarget || document.activeElement;
    setRsvpOpen(true);
  }, []);
  const closeRsvp = useCallback(() => {
    setRsvpOpen(false);
    window.requestAnimationFrame(() => rsvpTrigger.current?.focus?.({ preventScroll: true }));
  }, []);
  const openLightbox = useCallback((index, eventObject) => {
    lightboxTrigger.current = eventObject?.currentTarget || document.activeElement;
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    window.requestAnimationFrame(() => lightboxTrigger.current?.focus?.({ preventScroll: true }));
  }, []);

  const shareText = useMemo(
    () => `${event.couple.displayName} are celebrating ${event.anniversaryYears} beautiful years together on ${event.shortDateLabel} at ${event.venue.name}.`,
    [],
  );

  const copyInvitationLink = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(event.publicUrl);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = event.publicUrl;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("Copy command was not available");
      }
      showToast("Invitation link copied.");
    } catch {
      window.prompt("Copy this invitation link:", event.publicUrl);
    }
  }, [showToast]);

  const shareInvitation = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: event.metadata.title, text: shareText, url: event.publicUrl });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    await copyInvitationLink();
  }, [copyInvitationLink, shareText]);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${event.publicUrl}`)}`;

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to invitation</a>
      <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>

      <header className="site-header" data-header ref={headerRef}>
        <a className="brand" href="#top" aria-label={`${event.couple.displayName} anniversary invitation, back to top`}>
          <span className="brand-monogram">{event.couple.monogram}</span>
          <span className="brand-rule" aria-hidden="true" />
          <span className="brand-years">{event.anniversaryYears}</span>
        </a>
        <nav className="desktop-nav" aria-label="Invitation sections">
          <a href="#story">Our story</a><a href="#details">Details</a><a href="#gallery">Memories</a><a href="#venue">Venue</a>
        </nav>
        <button className="header-share" type="button" data-share aria-label="Share invitation" onClick={shareInvitation}><Icon name="share" /><span>Share</span></button>
      </header>

      <main id="main-content">
        <Hero onCalendar={openCalendar} onRsvp={openRsvp} />
        <OpeningInvitation />
        <Story />
        <EventDetails onCalendar={openCalendar} onRsvp={openRsvp} />
        <Gallery onOpen={openLightbox} />
        <Venue showToast={showToast} />
        <RsvpCallout onRsvp={openRsvp} />
        <Closing onRsvp={openRsvp} onShare={shareInvitation} />
      </main>

      <footer className="site-footer">
        <div className="footer-mark" aria-hidden="true">{event.couple.monogram} <span /> 25</div>
        <p>{event.couple.displayName} · {event.shortDateLabel}</p>
        <p>Made with love for a beautiful celebration.</p>
        <a className="footer-share" href={whatsappUrl} data-whatsapp-share target="_blank" rel="noopener noreferrer">Share on WhatsApp</a>
      </footer>

      <nav className="quick-actions" aria-label="Invitation quick actions">
        <button type="button" data-calendar-open onClick={openCalendar}><Icon name="calendar" /><span>Calendar</span></button>
        <a href={event.venue.directionsUrl} target="_blank" rel="noopener noreferrer"><Icon name="location" /><span>Directions</span></a>
        <button type="button" data-share onClick={shareInvitation}><Icon name="share" /><span>Share</span></button>
        <button type="button" data-rsvp-open onClick={openRsvp}><Icon name="check" /><span>RSVP</span></button>
      </nav>

      <button
        className="back-to-top"
        type="button"
        data-back-to-top
        aria-label="Back to top"
        ref={backToTopRef}
        onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })}
      ><Icon name="arrow-up" /></button>

      <div className={`toast ${toast ? "is-visible" : ""}`} data-toast role="status" aria-live="polite" aria-atomic="true">{toast}</div>

      <Lightbox open={lightboxOpen} initialIndex={lightboxIndex} reducedMotion={reducedMotion} onClose={closeLightbox} />
      <CalendarDialog open={calendarOpen} onClose={closeCalendar} />
      <RsvpDialog open={rsvpOpen} onClose={closeRsvp} />
    </>
  );
}

window.__ANNIVERSARY_TEST__ = Object.freeze({
  buildGoogleCalendarUrl,
  getCountdownState,
  validateRsvp,
});

const rootElement = document.getElementById("anniversary-root");
if (!rootElement) throw new Error("Anniversary invitation root was not found.");
createRoot(rootElement).render(<App />);
