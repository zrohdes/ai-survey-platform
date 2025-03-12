import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateSurveyQuestions, analyzeSurveyResponses } from "./ai-service";
import { insertUserSchema, insertSurveySchema, insertResponseSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Survey routes
  app.post("/api/surveys", async (req, res) => {
    try {
      const surveyData = insertSurveySchema.parse(req.body);
      const survey = await storage.createSurvey(surveyData);
      res.json(survey);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/surveys/:id", async (req, res) => {
    try {
      const survey = await storage.getSurvey(Number(req.params.id));
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      res.json(survey);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/surveys", async (req, res) => {
    try {
      const surveys = await storage.getSurveysByUser(Number(req.params.userId));
      res.json(surveys);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Response routes
  app.post("/api/surveys/:id/responses", async (req, res) => {
    try {
      const responseData = insertResponseSchema.parse(req.body);
      const response = await storage.createResponse(responseData);
      res.json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/surveys/:id/responses", async (req, res) => {
    try {
      const responses = await storage.getResponsesBySurvey(Number(req.params.id));
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI routes
  app.post("/api/ai/generate-questions", async (req, res) => {
    try {
      const { topic, numQuestions, types } = req.body;
      const questions = await generateSurveyQuestions({
        topic,
        numQuestions,
        types,
      });
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/analyze-responses", async (req, res) => {
    try {
      const { responses } = req.body;
      const analysis = await analyzeSurveyResponses(responses);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}