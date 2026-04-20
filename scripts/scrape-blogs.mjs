/**
 * One-off / refresh: pulls article HTML from legacy abexis.ch blog posts.
 * Output: src/data/blog-posts.json (committed for builds without network).
 */
import { writeFileSync } from "node:fs";
import { load } from "cheerio";

const BASE = "https://www.abexis.ch";
const BLOG_LIST = new URL("/blog", BASE).toString();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "user-agent": "AbexisSiteMigration/1.0" } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

function extractSlugsFromListHtml(html) {
  const $ = load(html);
  const out = [];
  $("a.blogpostlist__title-link[href^='/blog/']").each((_, el) => {
    const href = $(el).attr("href");
    const title = $(el).text().trim();
    if (!href || href === "/blog") return;
    out.push({ path: href, title });
  });
  const seen = new Set();
  return out.filter((p) => {
    if (seen.has(p.path)) return false;
    seen.add(p.path);
    return true;
  });
}

function extractPost(html, url) {
  const $ = load(html);
  const h1 = $("h1.blogpost__post-title").first().text().trim();
  const time = $("time.blogpost__timestamp").attr("datetime") ?? "";
  const bodyHtml = $("div.blogpost__post-body[itemprop='articleBody']").html() ?? "";
  const tags = [];
  $("a.blogpost__tag-link .blogpost__tag-text").each((_, el) => {
    tags.push($(el).text().trim());
  });
  return {
    url,
    title: h1,
    publishedISO: time,
    tags,
    bodyHtml: bodyHtml.trim(),
  };
}

async function main() {
  console.log("Fetching blog index…");
  const listHtml = await fetchText(BLOG_LIST);
  const posts = extractSlugsFromListHtml(listHtml);
  console.log(`Found ${posts.length} posts`);

  const results = [];
  for (let i = 0; i < posts.length; i++) {
    const { path, title: listTitle } = posts[i];
    const url = new URL(path, BASE).toString();
    process.stdout.write(`[${i + 1}/${posts.length}] ${path} … `);
    try {
      const html = await fetchText(url);
      const post = extractPost(html, url);
      if (!post.title) post.title = listTitle;
      if (!post.bodyHtml) {
        console.log("EMPTY BODY");
      } else {
        console.log("ok");
      }
      results.push({ slug: path.replace(/^\/blog\//, ""), listTitle, ...post });
    } catch (e) {
      console.log("FAIL", e.message);
      results.push({
        slug: path.replace(/^\/blog\//, ""),
        listTitle,
        url,
        title: listTitle,
        publishedISO: "",
        tags: [],
        bodyHtml: "",
        error: String(e.message),
      });
    }
    await sleep(350);
  }

  const outPath = new URL("../src/data/blog-posts.json", import.meta.url);
  writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");
  console.log("Wrote", outPath.pathname);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
