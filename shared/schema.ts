import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  userId: integer("user_id").references(() => users.id),
  questions: json("questions").$type<Question[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").references(() => surveys.id),
  answers: json("answers").$type<Answer[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Question = {
  id: number;
  text: string;
  type: 'multiple_choice' | 'text' | 'rating';
  options?: string[];
};

export type Answer = {
  questionId: number;
  value: string | number;
};

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
});

export const insertSurveySchema = createInsertSchema(surveys).pick({
  title: true,
  description: true,
  userId: true,
  questions: true,
});

export const insertResponseSchema = createInsertSchema(responses).pick({
  surveyId: true,
  answers: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Survey = typeof surveys.$inferSelect;
export type Response = typeof responses.$inferSelect;
