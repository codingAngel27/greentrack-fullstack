import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Loan } from '../loans.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Equipment } from '../../equipments/equipments.model';
import { EquipmentsService } from '../../equipments/equipments.service';
import { LoansService } from '../loans.service';
import { LoanPayload } from '../loans.dto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loans-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './loans-modal.component.html',
  styleUrl: './loans-modal.component.css'
})
export class LoansModalComponent implements OnInit {

  /*
  * Préstamo seleccionado para editar. Si es null, se asume que es para crear uno nuevo.
  */
  @Input() selectedLoan: Loan | null = null;
  @Output() onSave = new EventEmitter<Loan>();
  @Output() onClose = new EventEmitter<void>();

  loanForm!: FormGroup;
  isSubmitting = false;
  title = 'Agregar Préstamo';
  availableEquipment: Equipment[] = [];

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private equipmentService: EquipmentsService
  ) { }

  /**
   * Inicialización del formulario.
   */
  ngOnInit(): void {
    this.loanForm = this.fb.group({
      employee: ['', Validators.required],
      returnDate: ['', Validators.required],
      equipment: this.fb.group({
        id: [null, Validators.required]
      })
    });

    // Carga los equipos disponibles para el dropdown
    this.loadAvailableEquipment();
  }

  /**
   * Carga los equipos para el <select>
   */
  loadAvailableEquipment(): void {
    this.equipmentService.getAllEquipments(0, 1000).subscribe({
      next: (response) => {
        this.availableEquipment = response.data;


        if (this.selectedLoan) {
          this.title = 'Editar Préstamo';

          let formattedReturnDate = '';

          if (this.selectedLoan.dateReturn) {

            // Recorta el string al formato YYYY-MM-DDTHH:mm
            formattedReturnDate = this.selectedLoan.dateReturn.slice(0, 16);
          }
          this.loanForm.patchValue({
            employee: this.selectedLoan.employee,
            returnDate: formattedReturnDate,
            equipment: {
              id: (this.selectedLoan as any).equipmentId
            }
          });
        }
      },
      error: (err) => {
        console.error('Error cargando equipos', err);
        Swal.fire('Error', 'No se pudieron cargar los equipos disponibles.', 'error');
      }
    });
  }

  /**
   * Crear o actualizar
   */
  save(): void {
    if (this.loanForm.invalid) {
      this.loanForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const loanData = this.loanForm.value as LoanPayload;

    // Si hay prestamo seleccionado → EDITAR PRESTAMO
    if (this.selectedLoan && this.selectedLoan.id) {
      this.loansService.update(this.selectedLoan.id, loanData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'success',
            title: 'Actualizado correctamente',
            text: response.message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1800,
          });
          this.onSave.emit(response.data[0]);
          this.close();
        },
        error: (err) => {
          this.isSubmitting = false;
          // Captura el error específico del backend (equipo prestado)
          if (err.error?.message.includes('El equipo seleccionado ya está prestado')) {
            Swal.fire('Equipo no disponible', err.error.message, 'warning');
          } else {
            Swal.fire('Error al actualizar', err.error?.message || 'Error inesperado', 'error');
          }
        }
      });
    } else {
      // Si NO hay prestamo seleccionado → AGREGAR PRESTAMO
      this.loansService.create(loanData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'success',
            title: 'Guardado correctamente',
            text: response.message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1800,
          });
          this.onSave.emit(response.data[0]);
          this.close();
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.error?.message.includes('El equipo seleccionado ya está prestado')) {
            Swal.fire('Equipo no disponible', err.error.message, 'warning');
          } else {
            Swal.fire('Error al crear', err.error?.message || 'Error inesperado', 'error');
          }
        }
      });
    }
  }

  /**
   * Cerrar modal
   */
  close(): void {
    this.onClose.emit();
  }

}
