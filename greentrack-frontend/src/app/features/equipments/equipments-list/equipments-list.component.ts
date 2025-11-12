import { Component, OnInit } from '@angular/core';
import { Equipment } from '../equipments.model';
import { EquipmentsService } from '../equipments.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';
import { EquipmentsModalComponent } from '../equipments-modal/equipments-modal.component';
import { EquipmentNotificationService } from '../../../core/service/equipment-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipments-list',
  standalone: true,
  imports: [NgForOf, CommonModule, FormsModule, EquipmentsModalComponent],
  templateUrl: './equipments-list.component.html',
  styleUrl: './equipments-list.component.css'
})
export class EquipmentListComponent implements OnInit {
  equipments: Equipment[] = [];
  filterField: string = 'brand';
  filterValue: string = '';
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;

  equipmentList: Equipment[] = [];
  isModalOpen = false;
  selectedEquipment: any = null;

  constructor(
    private equipmentService: EquipmentsService,
    private notificationService: EquipmentNotificationService) { }

  ngOnInit(): void {
    this.loadEquipments();
  }

  /**
   * Carga la lista paginada de equipos
   */
  loadEquipments(): void {
    this.equipmentService.getAllEquipments(this.page, this.size).subscribe({
      next: (response: any) => {
        this.equipments = response.data;
        this.totalPages = response.totalPages;
        this.page = response.currentPage;
      },
      error: (error) => {
        console.error('Error al cargar equipos', error);
      }
    });
  }

  /*
  *Cambia de página y recarga la lista de equipos.
  */
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.loadEquipments();
    }
  }

  /*
  * Limpia los filtros y recarga la lista completa de equipos.
*/
  clearFilters(): void {
    this.filterValue = '';
    this.page = 0;
    this.loadEquipments();
  }
  /*
  * Filtra los equipos según el campo y valor especificados.
  */
  filter(): void {
    if (!this.filterValue.trim()) {
      this.loadEquipments();
      return;
    }

    const type = this.filterField === 'type' ? this.filterValue : undefined;
    const brand = this.filterField === 'brand' ? this.filterValue : undefined;

    this.equipmentService
      .filterEquipments(type, brand, this.page, this.size)
      .subscribe({
        next: (response) => (this.equipments = response.data),
        error: (err) => console.error(err),
      });
  }
  /** Abre el modal de creación de un nuevo equipo.
*/
  openCreateModal(): void {
    this.selectedEquipment = null;
  }
  /*
* Abre el modal de edición con el equipo seleccionado.
*/
  openEditModal(equipment: Equipment): void {
    this.selectedEquipment = equipment;
    this.isModalOpen = true;
  }

  /*
  * Maneja el guardado (creación o edición) de un equipo.
  * Cierra el modal, notifica la actualización y recarga la lista de equipos.
  */
  handleSave(equipment: Equipment) {
    this.isModalOpen = false;
    this.notificationService.notifyEquipmentUpdate();
    this.loadEquipments();
  }

  /*
  * Confirma y ejecuta la eliminación de un equipo (Valida si esta prestado o en el historial de préstamos). 
   */
  confirmDelete(equipment: Equipment): void {
    if (!equipment.id) return;

    if (equipment.state === 'PRESTADO') {
      Swal.fire({
        icon: 'error',
        title: 'Acción no permitida',
        text: 'No se puede eliminar un equipo que se encuentra "Prestado".',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#fff5f5',
        iconColor: '#c53030'
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar "${equipment.name}"? No podrás revertir esto.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.equipmentService.delete(equipment.id!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El equipo ha sido eliminado correctamente.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1800,
              background: '#f0fff4',
              iconColor: '#2f855a'
            });

            this.loadEquipments();
            this.notificationService.notifyEquipmentUpdate();
          },
          error: (err) => {
            let title = 'Error al eliminar';
            let text = 'Ocurrió un error inesperado.';

            const errorMessage = err.error?.message || '';

            if (errorMessage.includes('ConstraintViolationException')) {
              title = 'Acción no permitida';
              text = 'No se puede eliminar este equipo porque tiene un historial de préstamos asociados.';
            } else {

              text = errorMessage || 'Ocurrió un error inesperado.';
            }

            Swal.fire({
              icon: 'error',
              title: title,
              text: text,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              background: '#fff5f5',
              iconColor: '#c53030'
            });
          }
        });
      }
    });
  }
}
