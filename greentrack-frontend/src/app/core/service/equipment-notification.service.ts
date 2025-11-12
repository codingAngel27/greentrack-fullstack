import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentNotificationService {

  private equipmentUpdate$ = new Subject<void>();

  public equipmentUpdated$ = this.equipmentUpdate$.asObservable();


  /*
  * Notifica a los suscriptores que ha habido una actualización en el equipo.
  */
  notifyEquipmentUpdate(): void {
    console.log('Notificando actualización de equipo...');
    this.equipmentUpdate$.next();
  }
}