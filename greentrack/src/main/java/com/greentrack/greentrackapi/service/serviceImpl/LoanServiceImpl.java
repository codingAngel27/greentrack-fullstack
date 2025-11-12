package com.greentrack.greentrackapi.service.serviceImpl;
import com.greentrack.greentrackapi.entity.Equipment;
import com.greentrack.greentrackapi.entity.EquipmentState;
import com.greentrack.greentrackapi.entity.Loan;
import com.greentrack.greentrackapi.entity.LoanState;
import com.greentrack.greentrackapi.exception.ResourceNotFoundException;
import com.greentrack.greentrackapi.repository.IEquipmentRepository;
import com.greentrack.greentrackapi.repository.ILoanRepository;
import com.greentrack.greentrackapi.service.ILoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
@Service
public class LoanServiceImpl implements ILoanService {

    @Autowired
    private ILoanRepository loanRepository;


    @Autowired
    private IEquipmentRepository equipmentRepository;

    @Override
    public List<Loan> findAll() {
        return loanRepository.findAll();
    }

    @Override
    public Page<Loan> findAllPaged(Pageable pageable) {
        return loanRepository.findAll(pageable);
    }

    @Override
    public Loan findById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo no encontrado con id: " + id));
    }

    @Override
    public Loan save(Loan loan) {
        // Buscar el equipo en la BD
        Equipment equipment = equipmentRepository.findById(loan.getEquipment().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Equipo no encontrado con id: " + loan.getEquipment().getId()));

        if (equipment.getState() == EquipmentState.PRESTADO) {
            throw new IllegalStateException("El equipo ya está prestado");
        }

        // Crear un objeto Loan limpio
        Loan newLoan = new Loan();
        newLoan.setEmployee(loan.getEmployee());
        newLoan.setEquipment(equipment);
        newLoan.setLoanDate(LocalDateTime.now());
        newLoan.setState(LoanState.ACTIVO);
        newLoan.setReturnDate(loan.getReturnDate());

        // Cambiar el estado del equipo
        equipment.setState(EquipmentState.PRESTADO);
        equipmentRepository.save(equipment);

        return loanRepository.save(newLoan);
    }



    // Registrar devolución
    @Override
    public Loan markAsReturned(Long id) {
        Loan loan = findById(id);
        Equipment equipment = loan.getEquipment();

        loan.setReturnDate(LocalDateTime.now());
        loan.setState(LoanState.DEVUELTO);

        equipment.setState(EquipmentState.DISPONIBLE);
        equipmentRepository.save(equipment);

        return loanRepository.save(loan);
    }
    @Override
    public Loan update(Long id, Loan loanDetails) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo no encontrado con id: " + id));

        // Solo actualizar campos editables
        loan.setEmployee(loanDetails.getEmployee());
        loan.setReturnDate(loanDetails.getReturnDate());
        // Si quieres permitir cambiar equipo, validar que el nuevo equipo esté disponible
        if (!loan.getEquipment().getId().equals(loanDetails.getEquipment().getId())) {
            Equipment newEquipment = equipmentRepository.findById(loanDetails.getEquipment().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + loanDetails.getEquipment().getId()));
            if (newEquipment.getState() == EquipmentState.PRESTADO) {
                throw new IllegalStateException("El equipo seleccionado ya está prestado");
            }

            // Liberar el equipo anterior si estaba asignado
            loan.getEquipment().setState(EquipmentState.DISPONIBLE);
            equipmentRepository.save(loan.getEquipment());

            // Asignar el nuevo equipo
            loan.setEquipment(newEquipment);
            newEquipment.setState(EquipmentState.PRESTADO);
            equipmentRepository.save(newEquipment);
        }

        return loanRepository.save(loan);
    }

    @Override
    public void delete(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo no encontrado con id: " + id));

        loanRepository.delete(loan);
    }
    @Override
    public Page<Loan> findByEmployee(String employee, Pageable pageable) {
        return loanRepository.findByEmployeeContainingIgnoreCase(employee, pageable);
    }

    @Override
    public Page<Loan> findByState(LoanState state, Pageable pageable) {
        return loanRepository.findByState(state, pageable);
    }

}
