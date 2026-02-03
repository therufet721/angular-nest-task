import { Document, Model } from 'mongoose';

declare module 'mongoose' {
  interface PaginateOptions {
    select?: object | string;
    sort?: object | string;
    populate?: object | string | Array<object | string>;
    lean?: boolean;
    leanWithId?: boolean;
    offset?: number;
    page?: number;
    limit?: number;
  }

  interface PaginateResult<T> {
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

  interface PaginateModel<T extends Document> extends Model<T> {
    paginate(
      query?: object,
      options?: PaginateOptions,
      callback?: (err: any, result: PaginateResult<T>) => void,
    ): Promise<PaginateResult<T>>;
  }
}
