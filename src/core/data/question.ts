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
  categoryName: ICategory;
}

export type { IQuestion };
