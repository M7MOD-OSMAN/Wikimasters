import { eq } from "drizzle-orm";
import db from "@/db/index";
import { articles, usersSync } from "@/db/schema";
import redis from "@/cache";

export type ArticleList = {
  id: number;
  title: string;
  createdAt: string;
  content: string;
  author: string | null;
  imageUrl?: string | null;
};

export async function getArticles() {
  const cached = await redis.get<ArticleList[]>("articles:all");
  if (cached) {
    console.log("🎯 Get Articles Cache Hit!");
    return cached;
  }

  const response = await db
    .select({
      title: articles.title,
      id: articles.id,
      createdAt: articles.createdAt,
      content: articles.content,
      author: usersSync.name,
      imageUrl: articles.imageUrl,
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id));

      console.log("🏹 Get Articles Cache Miss!");
  try {
    await redis.set("articles:all", JSON.stringify(response), {
      ex: 60,
    });
  } catch (err) {
    console.warn("Failed to set articles cache", err);
  }
  return response;
}

export async function getArticleById(id: number) {
  const response = await db
    .select({
      title: articles.title,
      id: articles.id,
      createdAt: articles.createdAt,
      content: articles.content,
      author: usersSync.name,
      imageUrl: articles.imageUrl,
    })
    .from(articles)
    .where(eq(articles.id, id))
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id));
  return response[0] ? response[0] : null;
}
