import { ANNIVERSARY_EVENT } from "./event-config.mjs";

export function getCountdownState(
  now = Date.now(),
  target = Date.parse(ANNIVERSARY_EVENT.startIso),
) {
  const difference = target - now;
  if (!Number.isFinite(difference) || difference <= 0) {
    return { complete: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    complete: false,
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference % 86_400_000) / 3_600_000),
    minutes: Math.floor((difference % 3_600_000) / 60_000),
    seconds: Math.floor((difference % 60_000) / 1000),
  };
}
export function buildGoogleCalendarUrl(event = ANNIVERSARY_EVENT) {
  const startUtc = new Date(event.startIso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const parameters = new URLSearchParams({
    action: "TEMPLATE",
    text: event.calendar.title,
    dates: `${startUtc}/${startUtc}`,
    details: event.calendar.description,
    location: `${event.venue.name}, ${event.venue.address}`,
    ctz: event.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${parameters}`;
}

export function buildWhatsAppRsvpMessage(values, event = ANNIVERSARY_EVENT) {
  const attending = values.attending === "yes";
  const lines = [
    "25TH ANNIVERSARY RSVP",
    event.couple.displayName,
    "",
    "GUEST DETAILS",
    `Name: ${values.guestName}`,
    `Attendance: ${attending ? "Joyfully accepts" : "Regretfully declines"}`,
  ];

  if (attending) lines.push(`Number of guests: ${values.guestCount}`);
  lines.push(`Contact number: ${values.contactNumber}`);

  if (values.message) {
    lines.push("", "MESSAGE FOR THE COUPLE", values.message);
  }

  lines.push(
    "",
    "CELEBRATION",
    `Date: ${event.dateLabel}`,
    `Time: ${event.timeLabel}`,
    `Venue: ${event.venue.name}`,
  );

  return lines.join("\n");
}

export function buildWhatsAppRsvpUrl(values, event = ANNIVERSARY_EVENT) {
  const phoneNumber = String(event.rsvp.whatsappNumber || "").replace(/\D/g, "");
  if (!phoneNumber) throw new Error("A WhatsApp RSVP number has not been configured.");
  const message = buildWhatsAppRsvpMessage(values, event);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function validateRsvp(values) {
  const errors = {};
  if (values.guestName.length < 2) errors.guestName = "Please enter the guest name.";
  if (!values.attending) errors.attending = "Please tell us whether you will attend.";
  if (
    values.attending === "yes" &&
    (!Number.isInteger(values.guestCount) || values.guestCount < 1 || values.guestCount > 20)
  ) {
    errors.guestCount = "Please enter a guest count between 1 and 20.";
  }
  const phoneDigits = values.contactNumber.replace(/\D/g, "");
  if (phoneDigits.length < 7) errors.contactNumber = "Please enter a valid contact number.";
  if (values.message.length > 500) errors.message = "Please keep the message within 500 characters.";
  return errors;
}
