// ────────────────────────────────────────────────────────────────
// Wiki Engine — Motor de contenido colaborativo RDM
// Artículos versionados del patrimonio, historia y cultura
// ────────────────────────────────────────────────────────────────

export interface WikiArticle {
  articleId: string;
  slug: string;
  title: string;
  content: string;
  category: "historia" | "patrimonio" | "gastronomia" | "geografia" | "cultura" | "agentes" | "tecnologia";
  authorId: string;
  tags: string[];
  version: number;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface WikiRevision {
  revisionId: string;
  articleId: string;
  content: string;
  authorId: string;
  message: string;
  createdAt: string;
}

export interface WikiEngine {
  createArticle(data: Omit<WikiArticle, "articleId" | "version" | "createdAt" | "updatedAt">): Promise<WikiArticle>;
  updateArticle(articleId: string, content: string, authorId: string, message: string): Promise<WikiArticle | null>;
  getArticle(articleIdOrSlug: string): Promise<WikiArticle | null>;
  listArticles(category?: string, status?: string): Promise<WikiArticle[]>;
  getRevisions(articleId: string): Promise<WikiRevision[]>;
  searchArticles(query: string, limit?: number): Promise<WikiArticle[]>;
  deleteArticle(articleId: string): Promise<boolean>;
  stats(): Promise<{ total: number; byCategory: Record<string, number>; byStatus: Record<string, number>; totalRevisions: number }>;
}

export function createWikiEngine(): WikiEngine {
  const articles = new Map<string, WikiArticle>();
  const revisions = new Map<string, WikiRevision[]>();

  function tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
  }

  return {
    async createArticle(data) {
      const now = new Date().toISOString();
      const article: WikiArticle = {
        ...data,
        articleId: `wiki-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        version: 1,
        createdAt: now,
        updatedAt: now,
      };
      articles.set(article.articleId, article);
      revisions.set(article.articleId, [{
        revisionId: `rev-${Date.now()}`,
        articleId: article.articleId,
        content: data.content,
        authorId: data.authorId,
        message: "Initial creation",
        createdAt: now,
      }]);
      return article;
    },

    async updateArticle(articleId, content, authorId, message) {
      const article = articles.get(articleId);
      if (!article) return null;
      article.content = content;
      article.version += 1;
      article.updatedAt = new Date().toISOString();
      const revs = revisions.get(articleId) ?? [];
      revs.push({
        revisionId: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        articleId,
        content,
        authorId,
        message,
        createdAt: new Date().toISOString(),
      });
      revisions.set(articleId, revs);
      return article;
    },

    async getArticle(articleIdOrSlug) {
      const direct = articles.get(articleIdOrSlug);
      if (direct) return direct;
      for (const article of articles.values()) {
        if (article.slug === articleIdOrSlug) return article;
      }
      return null;
    },

    async listArticles(category, status) {
      return Array.from(articles.values()).filter((a) => {
        if (category && a.category !== category) return false;
        if (status && a.status !== status) return false;
        return true;
      });
    },

    async getRevisions(articleId) { return revisions.get(articleId) ?? []; },

    async searchArticles(query, limit = 20) {
      const tokens = tokenize(query);
      return Array.from(articles.values())
        .filter((a) => {
          const docTokens = tokenize(`${a.title} ${a.content} ${a.tags.join(" ")}`);
          return tokens.some((t) => docTokens.some((d) => d.includes(t) || t.includes(d)));
        })
        .slice(0, limit);
    },

    async deleteArticle(articleId) {
      revisions.delete(articleId);
      return articles.delete(articleId);
    },

    async stats() {
      const byCategory: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      let totalRevisions = 0;
      for (const article of articles.values()) {
        byCategory[article.category] = (byCategory[article.category] ?? 0) + 1;
        byStatus[article.status] = (byStatus[article.status] ?? 0) + 1;
      }
      for (const revs of revisions.values()) totalRevisions += revs.length;
      return { total: articles.size, byCategory, byStatus, totalRevisions };
    },
  };
}
