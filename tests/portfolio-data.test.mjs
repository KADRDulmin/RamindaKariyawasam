import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = path.join(ROOT, "src", "data.jsx");

async function portfolioData() {
  const source = await readFile(DATA_PATH, "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: DATA_PATH });
  return JSON.parse(JSON.stringify(context.window.RK));
}

test("portfolio catalogue has one complete record per verified project", async () => {
  const data = await portfolioData();
  const ids = data.projects.map((project) => project.id);
  assert.equal(data.projects.length, 24);
  assert.equal(new Set(ids).size, ids.length, "project IDs must be unique");
  assert.deepEqual(ids, [
    "greenmate", "ragbot", "timetable-gen2", "us-deed", "umis2", "examtrack", "enroll-now", "research-portal",
    "library-portal", "registration-kiosk", "intranet", "job-portal", "timetable-gen1", "lunch-ordering", "boc-payment",
    "sdg-widget", "landman", "influencelk", "kitchenpal", "planzevo", "doc-assist", "literanet", "edustay", "bus-black-box",
  ]);

  const required = ["id", "name", "tagline", "summary", "role", "organization", "period", "status", "featured", "categories", "capabilities", "stack", "architecture", "hardProblems", "features", "security", "operations", "links"];
  const categoryIds = new Set(data.projectCategories.map((category) => category.id));
  for (const project of data.projects) {
    for (const field of required) assert.ok(Object.hasOwn(project, field), `${project.id} is missing ${field}`);
    assert.ok(project.categories.length > 0, `${project.id} needs categories`);
    assert.ok(project.architecture.length >= 3, `${project.id} needs an architecture lane`);
    for (const category of project.categories) assert.ok(categoryIds.has(category), `${project.id} has unknown category ${category}`);
  }
  assert.equal(data.projects.filter((project) => project.featured).length, 4);
});

test("multi-category filters have evidence-backed membership", async () => {
  const data = await portfolioData();
  const members = (category) => data.projects.filter((project) => project.categories.includes(category)).map((project) => project.id);
  assert.deepEqual(members("featured"), ["greenmate", "ragbot", "timetable-gen2", "us-deed"]);
  assert.ok(members("nsbm").includes("greenmate"));
  assert.ok(members("ai").includes("timetable-gen1"));
  assert.ok(members("node").includes("influencelk"));
  assert.ok(members("java").includes("landman"));
  assert.ok(members("php").includes("research-portal"));
  assert.ok(members("mobile").includes("registration-kiosk"));
  assert.ok(members("independent").includes("edustay"));
});

test("only anonymously verified public repositories are exposed", async () => {
  const data = await portfolioData();
  const allowed = new Set([
    "https://github.com/KADRDulmin/Doc-Assist-Pro",
    "https://github.com/KADRDulmin/EduStay",
    "https://github.com/KADRDulmin/Bus-Black-Box-Mobile-App",
    "https://github.com/KADRDulmin/BUS-BLACK-BOX-SECURITY-SYSTEM",
  ]);
  const actual = data.projects.flatMap((project) => project.links.map((link) => link.url));
  assert.deepEqual(new Set(actual), allowed);
  for (const project of data.projects.filter((item) => item.categories.includes("nsbm") || item.categories.includes("java"))) {
    assert.equal(project.links.length, 0, `${project.id} must remain private`);
  }
});

test("unsupported metrics and stale positioning are absent", async () => {
  const files = ["src/data.jsx", "index.html", "llms.txt"];
  const combined = (await Promise.all(files.map((file) => readFile(path.join(ROOT, file), "utf8")))).join("\n");
  for (const stale of ["45+", "500+ users", "response time by 30%", "1.8M+", "Awsome", "no hallucination", "4+ years"]) {
    assert.equal(combined.includes(stale), false, `stale or unsupported phrase remains: ${stale}`);
  }
  assert.match(combined, /Full-stack software engineer building AI-enabled university platforms/);
  assert.match(combined, /Built as part of the NSBM development team/);
});

test("resume chooser points to five existing files and preserves the immutable original", async () => {
  const data = await portfolioData();
  assert.equal(data.resumeOptions.length, 5);
  for (const option of data.resumeOptions) {
    const local = path.join(ROOT, decodeURI(option.file).replace(/^\//, ""));
    assert.equal(existsSync(local), true, `${option.id} PDF does not exist`);
  }
  const original = await readFile(path.join(ROOT, "uploads", "Resume - Raminda Kariyawasam.pdf"));
  assert.equal(createHash("sha256").update(original).digest("hex").toUpperCase(), "F185F90DE4CF709EFEADE67C89B1593A1D06FB2747D5A0CF6685AF3E466954D0");
});

test("structured data is valid JSON and agrees with the visible role", async () => {
  const html = await readFile(path.join(ROOT, "index.html"), "utf8");
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, "JSON-LD block missing");
  const graph = JSON.parse(match[1])["@graph"];
  const person = graph.find((item) => item["@type"] === "Person");
  assert.equal(person.jobTitle, "Full-Stack Software Engineer");
  assert.match(person.description, /AI-enabled university platforms/);
});
