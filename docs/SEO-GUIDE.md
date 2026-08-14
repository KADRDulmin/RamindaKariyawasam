# SEO Guide for ramindak.com
### What you need to do manually — no coding required

The code changes are already done. Everything in this guide is stuff only **you** can do because it requires logging into accounts, uploading files, or creating images. Follow these steps after you deploy the latest code to your live site.

> `index.html` is generated for GitHub Pages. Make HTML or metadata edits in `src/index.template.html`, then run `npm run build` before committing.

---

## Step 1 — Create a Social Media Preview Image (OG Card)

When someone shares your site link on LinkedIn, Facebook, WhatsApp, Discord, or Twitter, a preview card appears. Right now the site uses your suit-pose photo, which is portrait (tall). For the best-looking preview cards you need a **landscape image at exactly 1200 × 630 pixels**.

**How to make it (free, no design skills needed):**

1. Go to [canva.com](https://www.canva.com) and sign in (free account is fine)
2. Click **Create a design** → **Custom size** → enter `1200` width, `630` height → **Create new design**
3. Set the background to cream `#f4e8cd` (your site's paper color)
4. Add your suit-pose photo on the left side
5. Add text on the right:
   - Big: **Raminda Kariyawasam**
   - Medium: **Software Engineer**
   - Small: **www.ramindak.com**
6. Export as PNG → save it as `og-card.png`
7. Place it in your project at `assets/og-card.png`
8. In `src/index.template.html`, update the `og:image` and `twitter:image` entries to `assets/og-card.png`, then run `npm run build`

---

## Step 2 — Create a Proper Favicon

A favicon is the tiny icon that appears in browser tabs and bookmarks. The code currently points to your suit photo, which technically works but will look cramped.

**How to make a proper one:**

1. Take a square crop of your face from any of your photos (use Paint, Canva, or any photo editor)
2. Save it as a PNG, ideally 512×512 pixels
3. Go to [realfavicongenerator.net](https://realfavicongenerator.net)
4. Upload your square photo
5. Customize colours if you want, then click **Generate your Favicons**
6. Download the package — it will contain `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png`
7. Place all those files at the **root** of your project (same folder as `index.html`)
8. In `src/index.template.html`, replace this line:
   ```html
   <link rel="icon" type="image/png" href="assets/photo-suit.png" />
   ```
   With these lines (copy-paste from the generator's instructions):
   ```html
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
   <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
   <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
   <link rel="shortcut icon" href="/favicon.ico">
   ```

---

## Step 3 — Set Up Google Search Console

This is how you tell Google your site exists and ask it to index you. It's free.

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **Add property** → choose **URL prefix** → enter `https://www.ramindak.com/`
4. **Verify ownership** — the easiest method:
   - Choose **HTML file** verification
   - Download the file Google gives you (named something like `googleXXXXXXXX.html`)
   - Place that file in the root of your project (same folder as `index.html`)
   - Deploy your site
   - Come back and click **Verify**
5. Once verified, go to **Sitemaps** in the left menu
6. Enter `sitemap.xml` in the box and click **Submit**
7. Go to **URL Inspection** → type `https://www.ramindak.com/` → click **Request Indexing**

Google will typically index your site within 1–7 days. You can monitor it in the **Coverage** and **Performance** reports.

---

## Step 4 — Set Up Bing Webmaster Tools

Bing powers search results on Bing, Yahoo, and DuckDuckGo. This is also free.

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Sign in with a Microsoft account
3. Click **Add a site** → enter `https://www.ramindak.com/`
4. **Fastest option:** Click **Import from Google Search Console** — Bing will automatically import your sitemap and verification from Step 3. This saves you doing everything twice.
5. If you prefer manual: verify with the XML file method (same process as Google) and submit `https://www.ramindak.com/sitemap.xml` under Sitemaps

---

## Step 5 — Add Google Analytics (Optional but Recommended)

Analytics shows you how many people visit your site, where they come from, and which sections they look at.

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **Start measuring** → create an account (your name) and a property (`ramindak.com`)
3. Choose **Web** → enter `https://www.ramindak.com/` → create stream
4. Copy your **Measurement ID** — it looks like `G-XXXXXXXXXX`
5. In `src/analytics.js`, replace the existing `G-...` measurement ID in both the `gtag("config", ...)` call and Google Tag Manager script URL, then run `npm run build`.

---

## Step 6 — Add Your Portfolio to Your LinkedIn Profile

LinkedIn links back to your site, which helps both search engines and recruiters discover you.

1. Go to your LinkedIn profile → click **Edit profile**
2. Scroll to the **Contact info** section → click the pencil icon
3. Under **Website**, add `https://www.ramindak.com/` with the label "Portfolio"
4. Save

---

## Step 7 — Test Everything Is Working

After you deploy, check these tools to confirm everything is set up correctly:

| What to check | Tool | What to look for |
|---|---|---|
| Structured data (JSON-LD) | [validator.schema.org](https://validator.schema.org) | Paste your JSON-LD, expect 0 errors |
| Social media preview | [opengraph.xyz](https://www.opengraph.xyz) | Enter `https://www.ramindak.com/` — should show your OG card |
| LinkedIn preview | [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/) | Enter your URL, click Inspect |
| Facebook/WhatsApp preview | [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/) | Enter your URL, click Scrape Again |
| Twitter/X card | [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) | Enter your URL, expect "summary_large_image" |
| Google rich results | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) | Enter your URL, expect Person schema detected |
| Page speed | [pagespeed.web.dev](https://pagespeed.web.dev) | Enter your URL, aim for 90+ on both mobile and desktop |
| Mobile-friendly | [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly) | Should pass |

---

## Step 8 — Keeping Your SEO Up to Date

Every time you update your portfolio content (add a new project, change your job title, etc.):

1. Open `sitemap.xml`
2. Update every `<lastmod>` date to today's date in the format `YYYY-MM-DD` (e.g. `2026-05-15`)
3. Deploy the change
4. Go to Google Search Console → Sitemaps → click your sitemap → click **Resubmit**
5. Do the same in Bing Webmaster Tools

This tells search engines there is fresh content to re-crawl.

---

## Step 9 — IndexNow (Bing Instant Indexing)

IndexNow tells Bing (and Yahoo, DuckDuckGo, and Bing's AI Copilot) about your page *instantly* the moment you update it, instead of waiting for their crawler to find it on its own.

The key file has already been created in your project at `7a4f2b8c1e5d93060b7f4a2e8c1d3095.txt`. Here's what to do after you deploy:

**Step 1 — Verify the key file is live**

Visit `https://www.ramindak.com/7a4f2b8c1e5d93060b7f4a2e8c1d3095.txt` in a browser. It should show just the text: `7a4f2b8c1e5d93060b7f4a2e8c1d3095`

**Step 2 — Submit your URL to Bing IndexNow**

Open this URL in your browser (or paste it in any API tool). It notifies Bing instantly:

```
https://api.indexnow.org/indexnow?url=https://www.ramindak.com/&key=7a4f2b8c1e5d93060b7f4a2e8c1d3095&keyLocation=https://www.ramindak.com/7a4f2b8c1e5d93060b7f4a2e8c1d3095.txt
```

You should get back a `200 OK` response. That's it — Bing is now notified.

**Step 3 — Re-submit whenever you update the site**

Every time you push a significant content change (new project, updated bio, etc.), re-visit that URL above to re-notify Bing. You can bookmark it.

---

## Step 10 — More Ways for People to Find You (Backlinks & Discoverability)

Every profile you create on a developer platform that links back to `www.ramindak.com` is a **backlink** — search engines treat these as votes of trust. The more quality backlinks you have, the higher you rank.

### Developer Profiles (create these, add your portfolio URL to each)

| Platform | What to do | Why it helps |
|---|---|---|
| **GitHub profile README** | Add your website to your GitHub profile bio (Edit profile → Website field) and create a `KADRDulmin/KADRDulmin` repo with a `README.md` that links to your site | GitHub has massive domain authority — a link from here carries real SEO weight |
| **Dev.to** | Create an account at [dev.to](https://dev.to), add `www.ramindak.com` to your profile, write 1–2 articles about projects you've built | Dev.to articles rank on Google themselves and link back to you |
| **Stack Overflow** | Go to your profile at [stackoverflow.com](https://stackoverflow.com) → Edit profile → add your website | High-authority backlink |
| **npm (if you publish packages)** | Add your website to your npm profile at [npmjs.com](https://www.npmjs.com) | Developer credibility signal |
| **Hashnode** | Create a blog at [hashnode.com](https://hashnode.com) and write about your projects. Every post can link back to your portfolio | Good domain authority, articles indexed by Google quickly |

### Portfolio Directories (submit your site to these — free)

| Directory | Link |
|---|---|
| Polywork | [polywork.com](https://www.polywork.com) |
| Peerlist | [peerlist.io](https://peerlist.io) |
| Read.cv | [read.cv](https://read.cv) |
| Wellfound (AngelList) | [wellfound.com](https://wellfound.com) — great for startup/tech visibility |
| Contra | [contra.com](https://contra.com) |

### Social Profiles — Add Your Website Link

Go to each platform you already use and add `https://www.ramindak.com/` to your profile bio/website field:

- Twitter/X profile
- Instagram bio (if you have one)
- Facebook profile (about section → website)
- YouTube channel (if applicable)

### If You Already Have These, Add Them to Your Code Too

If you have profiles on Dev.to, Stack Overflow, Hashnode, or any of the above, tell me and I'll add those URLs to the `sameAs` array in your JSON-LD structured data. This directly connects your identity across platforms in Google's knowledge graph.

---

## Step 10 — Write One Article About a Project You Built

This is the single highest-impact manual action you can take for SEO after the basics are set up.

Write a post on Dev.to or Hashnode about one of your projects — for example, how you built Roometry3D, or how you integrated an RAG bot at NSBM. A 600–1000 word technical article that:

- Mentions your name and `www.ramindak.com` multiple times
- Describes the problem, what you built, and the tech stack
- Links back to your portfolio at the end

This creates a separate page indexed by Google that mentions your name + skills, and it points traffic to your site. One good article can drive more organic traffic than weeks of meta tag tweaking.

---

## Summary Checklist

- [ ] Create 1200×630 OG card image in Canva and add to `assets/og-card.png`
- [ ] Update `og:image` and `twitter:image` in `src/index.template.html`, then run `npm run build`
- [ ] Generate proper favicon at realfavicongenerator.net and replace the icon tags
- [ ] Deploy the latest code to `www.ramindak.com`
- [ ] Set up Google Search Console and submit `sitemap.xml`
- [ ] Request indexing in Google Search Console
- [ ] Set up Bing Webmaster Tools (import from Google)
- [ ] Deploy and verify `7a4f2b8c1e5d93060b7f4a2e8c1d3095.txt` is accessible at your domain
- [ ] Submit IndexNow URL to notify Bing instantly
- [ ] (Optional) Add Google Analytics tracking ID
- [ ] Add portfolio URL to LinkedIn profile
- [ ] Add portfolio URL to GitHub profile bio
- [ ] Create a GitHub profile README (`KADRDulmin/KADRDulmin` repo) with a link to your site
- [ ] Create a Dev.to or Hashnode account and add your portfolio URL
- [ ] Submit your site to Polywork, Peerlist, and Wellfound
- [ ] Write one technical article about a project, linking back to your portfolio
- [ ] Tell me any new profiles (Dev.to, Stack Overflow, etc.) so I can add them to your JSON-LD `sameAs`
- [ ] Run all the testing tools in Step 7
- [ ] Update `<lastmod>` in `sitemap.xml` whenever you change content
