/*
* Modelo de respuesta de la API
* */
export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}