import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Loan } from './loans.model';
import { ApiResponse } from '../../core/models/api-response.model';
import { Observable } from 'rxjs';
import { LoanPayload } from './loans.dto';

@Injectable({
  providedIn: 'root'
})
export class LoansService {

  private readonly apiUrl = `${environment.apiUrl}/loans`; // API de Préstamos

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los préstamos (paginado)
   */
  getAllLoans(page: number = 0, size: number = 10): Observable<ApiResponse<Loan>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<Loan>>(`${this.apiUrl}/paged`, { params });
  }

  /**
   * Filtrar (por nombre de empleado o estado)
   */
  filterLoans(employee?: string, state?: string, page: number = 0, size: number = 10): Observable<ApiResponse<Loan>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (employee && employee.trim() !== '') {
      params = params.set('employee', employee);
    }
    if (state) {
      params = params.set('state', state);
    }
    return this.http.get<ApiResponse<Loan>>(`${this.apiUrl}/filter`, { params });
  }

  /**
   * Crear un nuevo préstamo
   */
  create(payload: LoanPayload): Observable<ApiResponse<Loan>> {
    return this.http.post<ApiResponse<Loan>>(`${this.apiUrl}/create`, payload);
  }
  /**
   * Actualizar un préstamo existente
   */
  update(id: number, payload: LoanPayload): Observable<ApiResponse<Loan>> {
    return this.http.put<ApiResponse<Loan>>(`${this.apiUrl}/update/${id}`, payload);
  }

  /**
   * Actualizar (Devolver un préstamo)
   * Generalmente, la única "actualización" de un préstamo es marcarlo como devuelto.
   */
  returnLoan(id: number): Observable<ApiResponse<Loan>> {
    return this.http.patch<ApiResponse<Loan>>(`${this.apiUrl}/return/${id}`, {});
  }

  /**
   * Eliminar un préstamo (en caso de que el estado no este activo).
   */
  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }
}
