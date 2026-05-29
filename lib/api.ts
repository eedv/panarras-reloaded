import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { getTagsFromSlug } from "./tags";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory);
}

type PostData = {
  [key: string]: unknown;
  slug?: string;
  title?: string;
  date?: string;
  content?: string;
  tags?: string[];
  coverImage?: string;
  excerpt?: string;
  author?: { name: string; picture: string };
  ogImage?: { url: string };
};

export function getPostBySlug(slug: string, fields: string[] = []): PostData {
  let fileslug: string;
  try {
    fileslug = decodeURIComponent(slug).replace(/\.html\.md$/, "").replace(/\.md$/, "");
  } catch {
    fileslug = slug.replace(/\.html\.md$/, "").replace(/\.md$/, "");
  }
  const realSlug = fileslug;
  const fullPath = join(postsDirectory, `${fileslug}.html.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items: PostData = {};

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }
    if (field === "tags") {
      items[field] = getTagsFromSlug(realSlug);
    }
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []): PostData[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => {
      const d1 = new Date(post1.date || "").getTime()
      const d2 = new Date(post2.date || "").getTime()
      if (isNaN(d1) && isNaN(d2)) return 0
      if (isNaN(d1)) return 1
      if (isNaN(d2)) return -1
      return d2 - d1
    });
  return posts;
}
