import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { getTagsFromSlug } from "./tags";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const fileslug = slug.replace(/\.html\.md$/, "").replace(/\.md$/, "");
  const realSlug = fileslug;
  const fullPath = join(postsDirectory, `${fileslug}.html.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Items = { [key: string]: any };

  const items: Items = {};

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

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
