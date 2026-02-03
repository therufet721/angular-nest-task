export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
