import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDto } from './login-dto.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private readonly localStorageKey = 'currentUser';
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /*
    * Inicia sesión con las credenciales proporcionadas. Si la sesión se inicia correctamente, guarda los datos del usuario en localStorage.
    */
  login(credentials: LoginDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.localStorageKey, JSON.stringify(user));
        }
      })
    );
  }

/*
  * Cierra la sesión y elimina los datos del usuario de localStorage. Navega a la página de inicio de sesión.
  */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.localStorageKey);
    }
    this.router.navigate(['/auth/login']);
  }

  /*
  * Obtiene los datos del usuario actual desde localStorage.
  */
  get currentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : null;
  }

  /*
  * Verifica si el usuario está autenticado comprobando la presencia de datos del usuario en localStorage.
  */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return this.currentUser !== null;
  }
  
}
