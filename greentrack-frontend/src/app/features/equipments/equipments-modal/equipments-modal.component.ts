import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipmentsService } from '../equipments.service';
import { Validators } from '@angular/forms';
import { Equipment } from '../equipments.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-equipments-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './equipments-modal.component.html',
  styleUrl: './equipments-modal.component.css'
})
export class EquipmentsModalComponent implements OnInit {

  /*
  * Equipo seleccionado para editar. Si es null, se asume que es para crear uno nuevo.
  */
  @Input() selectedEquipment?: Equipment | null = null;
  @Output() onSave = new EventEmitter<Equipment>();
  @Output() onClose = new EventEmitter<void>();
  
  equipmentForm!: FormGroup;
  isSubmitting = false;
  title = 'Agregar equipo';

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentsService
  ) { }

  /*
  * Inicialización del formulario.
  */
  ngOnInit(): void {
    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      state: ['DISPONIBLE', Validators.required]
    });

    // Si hay equipo seleccionado → modo edición
    if (this.selectedEquipment) {
      this.title = 'Editar equipo';
      this.equipmentForm.patchValue(this.selectedEquipment);
    }
  }

  /*
  * Guarda el equipo (nuevo o editado).
  */
  save(): void {
    if (this.equipmentForm.invalid) return;

    this.isSubmitting = true;
    const equipmentData = this.equipmentForm.value as Equipment;

    // Si hay equipo seleccionado → EDITAR EQUIPO
    if (this.selectedEquipment && this.selectedEquipment.id) {
      this.equipmentService.update(this.selectedEquipment.id, equipmentData).subscribe({
        next: (response) => {
          this.isSubmitting = false;

          if (response.status === 400 && response.message.includes('Ya existe')) {
            Swal.fire({
              icon: 'warning',
              title: 'Equipo duplicado',
              text: response.message,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2500,
              background: '#fffbea',
              iconColor: '#b7791f'
            });
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Actualizado correctamente',
            text: response.message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1800,
            background: '#f0fff4',
            iconColor: '#2f855a'
          });

          // Emitir el equipo actualizado (primer elemento del array)
          this.onSave.emit(response.data[0]);
          this.close();
        },
        error: (err) => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
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

    } else {

      // Si NO hay equipo seleccionado → AGREGAR EQUIPO
      this.equipmentService.create(equipmentData).subscribe({
        next: (response) => {
          this.isSubmitting = false;

          if (response.status === 400 && response.message.includes('Ya existe')) {
            Swal.fire({
              icon: 'warning',
              title: 'Equipo duplicado',
              text: response.message,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2500,
              background: '#fffbea',
              iconColor: '#b7791f'
            });
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Guardado correctamente',
            text: response.message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1800,
            background: '#f0fff4',
            iconColor: '#2f855a'
          });

          // Emitir el nuevo equipo creado
          this.onSave.emit(response.data[0]);
          this.close();
        },
        error: (err) => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al crear',
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
  }

  /*
  * Cierra el modal.
  */
  close(): void {
    this.onClose.emit();
  }
}