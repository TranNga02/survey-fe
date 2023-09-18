import type { ICategory } from "./category";

interface IQuestion {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  type: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  category: ICategory;
}

interface IOption {
  key: string;
  value: number;
  isAnswer: boolean;
}

interface CreateQuestionParams {
  categoryId: number | null;
  title: string;
  description: string;
  type: number;
  order: number;
  options: IOption[];
}

export type { IQuestion, IOption, CreateQuestionParams };
