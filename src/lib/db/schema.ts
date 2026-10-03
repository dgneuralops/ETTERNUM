import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const tsvector = customType<{ data: string }>({
  dataType: () => "tsvector",
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  cpf: varchar("cpf", { length: 11 }).notNull().unique(),
  birthDate: date("birth_date", { mode: "string" }).notNull(),
  zodiacSign: text("zodiac_sign").notNull(),
  /** "trial" (padrão, vira gratuito quando o teste acaba) ou "premium". */
  plan: text("plan").notNull().default("trial"),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }).notNull(),
  /** Cápsula liberada no plano gratuito (definida na primeira conversa após o teste). */
  freeCapsuleSlug: text("free_capsule_slug"),
  /** Memória de longo prazo que o Etternum constrói sobre a pessoa. */
  memory: text("memory").notNull().default(""),
  memoryUpdatedAt: timestamp("memory_updated_at", { withTimezone: true }),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Respostas da triagem (onboarding). */
export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  occupation: text("occupation").notNull().default(""),
  likesToDo: text("likes_to_do").notNull().default(""),
  dislikesToDo: text("dislikes_to_do").notNull().default(""),
  difficulties: text("difficulties").notNull().default(""),
  dailyStressors: text("daily_stressors").notNull().default(""),
  biggestDrain: text("biggest_drain").notNull().default(""),
  likesToEat: text("likes_to_eat").notNull().default(""),
  dislikesToEat: text("dislikes_to_eat").notNull().default(""),
  goals: text("goals").notNull().default(""),
  interestAreas: text("interest_areas")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Quadro Eterno: as mentes favoritas da pessoa. */
export const favorites = pgTable(
  "favorites",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    agentSlug: text("agent_slug").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.agentSlug] })],
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** "chat" (uma mente ou o Maestro) ou "council" (várias mentes de uma área). */
    kind: text("kind").notNull(),
    agentSlug: text("agent_slug"),
    areaSlug: text("area_slug"),
    title: text("title").notNull(),
    /** Mensagens do usuário desde a última atualização de memória. */
    turnsSinceMemory: integer("turns_since_memory").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("conversations_user_updated_idx").on(t.userId, t.updatedAt)],
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    /** Desnormalizado para contar o uso diário sem join. */
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    /** Quem falou (cápsula, "maestro"); nulo para mensagens da pessoa. */
    agentSlug: text("agent_slug"),
    content: text("content").notNull(),
    /** A mensagem continha sinais de risco (exibe recursos de ajuda). */
    riskFlag: boolean("risk_flag").notNull().default(false),
    /** Copiada de outra conversa (encaminhamento do Maestro); não conta no limite diário. */
    forwarded: boolean("forwarded").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("messages_conversation_created_idx").on(t.conversationId, t.createdAt),
    index("messages_user_role_created_idx").on(t.userId, t.role, t.createdAt),
  ],
);

/** Trechos dos livros que alimentam cada cápsula (busca em texto completo em português). */
export const knowledgeChunks = pgTable(
  "knowledge_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    agentSlug: text("agent_slug").notNull(),
    /** Obra, edição e licença (ex.: "Cartas a Lucílio — trad. X, domínio público"). */
    source: text("source").notNull(),
    position: integer("position").notNull(),
    content: text("content").notNull(),
    searchVector: tsvector("search_vector").generatedAlwaysAs(sql`to_tsvector('portuguese', content)`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("knowledge_agent_idx").on(t.agentSlug), index("knowledge_search_idx").using("gin", t.searchVector)],
);

/** Lista de espera da landing page. */
export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
