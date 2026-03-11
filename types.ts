export type UserGoal = 'lose_weight' | 'maintain_weight' | 'gain_muscle';

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: UserGoal;
  allergies?: string;
  restrictions?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  name: string;
  description: string;
  nutrition: NutritionInfo;
}

export interface DailyPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks?: Meal[];
}

export interface Substitution {
  original: string;
  replacement: string;
}

export interface MealPlan {
  id: string; // For saving/keying
  name: string; // Name for the plan, derived from user request
  dailyPlan: DailyPlan;
  totalNutrition: NutritionInfo;
  substitutions: Substitution[];
  shoppingList: string[];
}

export interface Recipe {
  id: string; // For saving/keying
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutrition: NutritionInfo;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // NOTE: In a real app, this should be a securely stored hash.
}
