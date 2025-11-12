import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /*
  * Maneja el envío del formulario de inicio de sesión
  */ 
  onSubmit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;
    this.authService.login({ username, password }).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('user', JSON.stringify(response));
        console.log('Login correcto, navegando al panel...');
        this.router.navigate(['/panel']);
      },
      error: (err) => {
        console.error('Usuario o contraseña incorrectos:', err);
        this.error = 'Usuario o contraseña incorrectos';
        setTimeout(() => {
          this.error = '';
        }, 3000);
        this.form.reset();
      },
    });
  }
  
  /*
  * Alterna la visibilidad de la contraseña
  */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
