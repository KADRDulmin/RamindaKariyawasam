const urls = [
  "https://github.com/KADRDulmin/RamindaKariyawasam",
  "https://github.com/KADRDulmin",
  "https://github.com/KADRDulmin/Doc-Assist-Pro",
  "https://github.com/KADRDulmin/EduStay",
  "https://github.com/KADRDulmin/Bus-Black-Box-Mobile-App",
  "https://github.com/KADRDulmin/BUS-BLACK-BOX-SECURITY-SYSTEM",
];

const failures = [];
for (const url of urls) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "Raminda-portfolio-link-check/1.0" },
      signal: AbortSignal.timeout(20_000),
    });
    console.log(`${response.status} ${url}`);
    if (!response.ok) failures.push(`${response.status} ${url}`);
  } catch (error) {
    failures.push(`${url}: ${error.message}`);
  }
}

if (failures.length) {
  console.error("Public link failures:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
}
