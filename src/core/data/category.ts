interface ICategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateCategoryParams {
  name: string;
}

export type { ICategory, UpdateCategoryParams };
