import { User, InsertUser, Survey, InsertSurvey, Response, InsertResponse } from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Survey operations
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  getSurvey(id: number): Promise<Survey | undefined>;
  getSurveysByUser(userId: number): Promise<Survey[]>;
  
  // Response operations
  createResponse(response: InsertResponse): Promise<Response>;
  getResponsesBySurvey(surveyId: number): Promise<Response[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private surveys: Map<number, Survey>;
  private responses: Map<number, Response>;
  private currentIds: { user: number; survey: number; response: number };

  constructor() {
    this.users = new Map();
    this.surveys = new Map();
    this.responses = new Map();
    this.currentIds = { user: 1, survey: 1, response: 1 };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const user = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createSurvey(insertSurvey: InsertSurvey): Promise<Survey> {
    const id = this.currentIds.survey++;
    const survey = { ...insertSurvey, id, createdAt: new Date() };
    this.surveys.set(id, survey);
    return survey;
  }

  async getSurvey(id: number): Promise<Survey | undefined> {
    return this.surveys.get(id);
  }

  async getSurveysByUser(userId: number): Promise<Survey[]> {
    return Array.from(this.surveys.values()).filter(
      survey => survey.userId === userId
    );
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const id = this.currentIds.response++;
    const response = { ...insertResponse, id, createdAt: new Date() };
    this.responses.set(id, response);
    return response;
  }

  async getResponsesBySurvey(surveyId: number): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(
      response => response.surveyId === surveyId
    );
  }
}

export const storage = new MemStorage();
