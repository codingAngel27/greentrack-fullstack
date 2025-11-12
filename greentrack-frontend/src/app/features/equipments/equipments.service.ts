import { Injectable } from '@angular/core';
import { Equipment } from './equipments.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsService {
  private readonly apiUrl = `${environment.apiUrl}/equipments`;

  constructor(private http: HttpClient) { }

  /*
  * Lista todos los equipos con paginación.
  */
  getAllEquipments(page: number = 0, size: number = 10): Observable<ApiResponse<Equipment>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<Equipment>>(`${this.apiUrl}/paged`, { params });
  }

  /*
  * Filtra los equipos por marca o tipo.  
  */
  filterEquipments(type?: string, brand?: string, page: number = 0, size: number = 10): Observable<ApiResponse<Equipment>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (type) params = params.set('type', type);
    if (brand) params = params.set('brand', brand);
    return this.http.get<ApiResponse<Equipment>>(`${this.apiUrl}/filter`, { params });
  }

  /*
  * Crea un nuevo equipo.
  */
  create(equipment: Equipment): Observable<ApiResponse<Equipment>> {
    return this.http.post<ApiResponse<Equipment>>(`${this.apiUrl}/create`, equipment);
  }

  /*
  * Actualiza un equipo existente.
  */
  update(id: number, equipment: Equipment): Observable<ApiResponse<Equipment>> {
    return this.http.put<ApiResponse<Equipment>>(`${this.apiUrl}/update/${id}`, equipment);
  }
  /*
  * Elimina un equipo (si el equipo está disponible y no este en el historial de prestamos).
  */
  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }

}
