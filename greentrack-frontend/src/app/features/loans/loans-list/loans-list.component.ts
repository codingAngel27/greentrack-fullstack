import { Component, OnInit } from '@angular/core';
import { Loan } from '../loans.model';
import { LoansService } from '../loans.service';
import { EquipmentNotificationService } from '../../../core/service/equipment-notification.service';
import Swal from 'sweetalert2';;
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoansModalComponent } from '../loans-modal/loans-modal.component';

@Component({
  selector: 'app-loans-list',
  standalone: true,
  imports: [NgForOf, CommonModule, FormsModule, LoansModalComponent],
  templateUrl: './loans-list.component.html',
  styleUrl: './loans-list.component.css'
})
export class LoansListComponent implements OnInit {

  loans: Loan[] = [];
  filterField: string = 'employee';
  filterValue: string = '';
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;

  isModalOpen = false;
  selectedLoan: Loan | null = null;

  constructor(
    private loansService: LoansService,
    private notificationService: EquipmentNotificationService
  ) { }

  ngOnInit(): void {
    this.loadLoans();
  }

  /**
   * Carga la lista paginada de préstamos
   */
  loadLoans(): void {
    this.loansService.getAllLoans(this.page, this.size).subscribe({
      next: (response: any) => {
        this.loans = response.data;
        this.totalPages = response.totalPages;
        this.page = response.currentPage;
      },
      error: (error) => {
        console.error('Error al cargar préstamos', error);
      }
    });
  }

  /**
   * Cambia de página y recarga la lista
   */
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.loadLoans();
    }
  }

  /**
   * Limpia los filtros y recarga
   */
  clearFilters(): void {
    this.filterValue = '';
    this.page = 0;
    this.loadLoans();
  }

  /**
   * Aplica los filtros de 'employee' o 'state'
   */
  filter(): void {
    if (!this.filterValue.trim()) {
      this.loadLoans();
      return;
    }
    const employee = this.filterField === 'employee' ? this.filterValue : undefined;
    const state = this.filterField === 'state' ? this.filterValue : undefined;

    this.loansService
      .filterLoans(employee, state, this.page, this.size)
      .subscribe({
        next: (response) => (this.loans = response.data),
        error: (err) => console.error(err),
      });
  }

  /**
   * Abre el modal en modo CREAR
   */
  openCreateModal(): void {
    this.selectedLoan = null;
    this.isModalOpen = true;
  }

  /**
   * Abre el modal en modo EDITAR
   */
  openEditModal(loan: Loan): void {
    this.selectedLoan = loan;
    this.isModalOpen = true;
  }

  /**
   * Se ejecuta cuando el modal guarda (crea o edita)
   */
  handleSave(loan: Loan) {
    this.isModalOpen = false;
    this.notificationService.notifyEquipmentUpdate();
    this.loadLoans();
  }

  /**
   * Lógica para confirmar y eliminar un préstamo
   */
  confirmDelete(loan: Loan): void {
    if (!loan.id) return;

    // No se puede eliminar un préstamo que está ACTIVO
    if (loan.state === 'ACTIVO') {
      Swal.fire({
        icon: 'error',
        title: 'Acción no permitida',
        text: 'No se puede eliminar un préstamo que está "Activo".',
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
      text: `¿Deseas eliminar el préstamo a "${loan.employee}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loansService.delete(loan.id!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El préstamo ha sido eliminado correctamente.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1800,
              background: '#f0fff4',
              iconColor: '#2f855a'
            });

            this.loadLoans();

            this.notificationService.notifyEquipmentUpdate();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.message || 'Ocurrió un error inesperado.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2500,
              background: '#fff5f5',
              iconColor: '#c53030'
            });
          }
        });
      }
    });
  }

  /**
   * Confirma y ejecuta la devolución de un préstamo
   */
  confirmReturn(loan: Loan): void {
    if (!loan.id || loan.state === 'DEVUELTO') {
      return;
    }

    Swal.fire({
      title: 'Confirmar Devolución',
      text: `¿Estás seguro que deseas marcar como devuelto el equipo prestado a "${loan.employee}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f855a',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡Devolver!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loansService.returnLoan(loan.id!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Devuelto!',
              text: 'El préstamo se marcó como devuelto correctamente.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1800,
              background: '#f0fff4',
              iconColor: '#2f855a'
            });

            this.loadLoans();
            this.notificationService.notifyEquipmentUpdate();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al devolver',
              text: err.error?.message || 'Ocurrió un error inesperado.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2500,
              background: '#fff5f5',
              iconColor: '#c53030'
            });
          }
        });
      }
    });
  }
}