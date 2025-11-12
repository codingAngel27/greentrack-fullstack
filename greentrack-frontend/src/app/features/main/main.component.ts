import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { EquipmentNotificationService } from '../../core/service/equipment-notification.service';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet,CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  user = this.authService.currentUser;
  equiposDisponibles = 0;
  equiposPrestados = 0;
  stats: any[] = [];
  private updateSubscription!: Subscription;

  constructor(
    private authService: AuthService, 
    private http: HttpClient,
  private notificationService: EquipmentNotificationService) {}

  ngOnInit(): void {
    this.loadContadores();
    this.updateSubscription = this.notificationService.equipmentUpdated$
      .subscribe(() => {
        console.log('¡Notificación recibida en MainComponent! Recargando stats...');
        this.loadContadores(); 
      });
  }

 loadContadores(): void {

    this.http.get<any>(`${environment.apiUrl}/equipments/count`).subscribe({

      next: (data) => {

        this.equiposDisponibles = data.disponibles;

        this.equiposPrestados = data.prestados;

         this.stats = [

          { title: 'Equipos Disponibles', value: this.equiposDisponibles },

          { title: 'Equipos Prestados', value: this.equiposPrestados },

        ];

      },

      error: (err) => console.error('Error al cargar contadores', err),

    });

  }

  logout(): void {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}