package com.greentrack.greentrackapi.controller;


import com.greentrack.greentrackapi.dto.ApiResponse;
import com.greentrack.greentrackapi.dto.LoanResponseDto;
import com.greentrack.greentrackapi.entity.Loan;
import com.greentrack.greentrackapi.entity.LoanState;
import com.greentrack.greentrackapi.service.serviceImpl.LoanServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/loans")
@Api(tags = "Préstamos", description = "Operaciones relacionadas con los préstamos de equipos")
public class LoanController {
    @Autowired
    private LoanServiceImpl loanService;

    /**
     * Lista sin paginación
     */
    @ApiOperation(value = "Listar todos los prestamos sin paginación")
    @GetMapping
    public ResponseEntity<ApiResponse<LoanResponseDto>> getAll() {
        List<LoanResponseDto> loans = loanService.findAll()
                .stream()
                .map(l -> new LoanResponseDto(
                        l.getId(),
                        l.getEmployee(),
                        l.getEquipment().getName(),
                        l.getEquipment().getId(),
                        l.getLoanDate(),
                        l.getReturnDate(),
                        l.getState()))
                .collect(Collectors.toList());

        ApiResponse<LoanResponseDto> response = new ApiResponse<>(
                "Lista de préstamos obtenida correctamente",
                HttpStatus.OK.value(),
                loans,
                loans.size(),
                1,
                1,
                loans.size()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Lista con paginación
     */
    @ApiOperation(value = "Listar todos los prestamos con paginación")
    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<LoanResponseDto>> getPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Page<Loan> pageResult = loanService.findAllPaged(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        );

        List<LoanResponseDto> content = pageResult.getContent()
                .stream()
                .map(l -> new LoanResponseDto(
                        l.getId(),
                        l.getEmployee(),
                        l.getEquipment().getName(),
                        l.getEquipment().getId(),
                        l.getLoanDate(),
                        l.getReturnDate(),
                        l.getState()))
                .collect(Collectors.toList());

        ApiResponse<LoanResponseDto> response = new ApiResponse<>(
                "Préstamos paginados obtenidos correctamente",
                HttpStatus.OK.value(),
                content,
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getNumber(),
                pageResult.getSize()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene préstamo por ID
     */
    @ApiOperation(value = "Obtiene préstamo por el ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanResponseDto>> getById(@PathVariable Long id) {
        Loan l = loanService.findById(id);
        LoanResponseDto dto = new LoanResponseDto(
                l.getId(),
                l.getEmployee(),
                l.getEquipment().getName(),
                l.getEquipment().getId(),
                l.getLoanDate(),
                l.getReturnDate(),
                l.getState()
        );

        ApiResponse<LoanResponseDto> response = new ApiResponse<>(
                "Préstamo encontrado correctamente",
                HttpStatus.OK.value(),
                List.of(dto),
                1,
                1,
                1,
                1
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Crea préstamo
     */
    @ApiOperation(value = "Crea un nuevo préstamo")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<LoanResponseDto>> create(@RequestBody Loan dto) {
        Loan saved = loanService.save(dto);

        LoanResponseDto responseDto = new LoanResponseDto(
                saved.getId(),
                saved.getEmployee(),
                saved.getEquipment().getName(),
                saved.getEquipment().getId(),
                saved.getLoanDate(),
                saved.getReturnDate(),
                saved.getState()
        );

        ApiResponse<LoanResponseDto> response = new ApiResponse<>(
                "Préstamo registrado correctamente",
                HttpStatus.CREATED.value(),
                List.of(responseDto),
                1,
                1,
                1,
                1
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Actualiza préstamo
     */
    @ApiOperation(value = "Actualiza un préstamo solo datos como empleado y equipo")
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<Loan>> update(
            @PathVariable Long id,
            @RequestBody Loan loanDetails) {

        Loan updated = loanService.update(id, loanDetails);

        ApiResponse<Loan> response = new ApiResponse<>(
                "Préstamo actualizado correctamente",
                HttpStatus.OK.value(),
                List.of(updated),
                1,
                1,
                1,
                1
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Regresa préstamo y cambia a estado devuelto
     */
    @ApiOperation(value = "Actualiza un préstamo cuando devuelve el equipo y cambia a estado devuelto")
    @PatchMapping("/return/{id}")
    public ResponseEntity<ApiResponse<LoanResponseDto>> markAsReturned(@PathVariable Long id) {
        Loan returned = loanService.markAsReturned(id);
        LoanResponseDto responseDto = new LoanResponseDto(
                returned.getId(),
                returned.getEmployee(),
                returned.getEquipment().getName(),
                returned.getEquipment().getId(),
                returned.getLoanDate(),
                returned.getReturnDate(),
                returned.getState()
        );
        ApiResponse<LoanResponseDto> response = new ApiResponse<>(
                "Equipo devuelto correctamente",
                HttpStatus.OK.value(),
                List.of(responseDto),
                1,
                1,
                1,
                1
        );

        return ResponseEntity.ok(response);
    }
    /**
     * Elimina préstamo si no esta activo
     */
    @ApiOperation(value = "Elimina préstamo si no esta activo")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        Loan loan = loanService.findById(id);

        if (loan.getState() == LoanState.ACTIVO) {
            ApiResponse<Void> response = new ApiResponse<>(
                    "No se puede eliminar un préstamo activo",
                    HttpStatus.CONFLICT.value(),
                    null,
                    0,
                    0,
                    0,
                    0
            );
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        loanService.delete(id);

        ApiResponse<Void> response = new ApiResponse<>(
                "Préstamo eliminado correctamente",
                HttpStatus.NO_CONTENT.value(),
                null,
                0,
                0,
                0,
                0
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    /**
     * Filtra por Empleado o Estado
     */
    @ApiOperation(value = "Filtra por Empleado o Estado")
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<Loan>> filterLoans(
            @RequestParam(required = false) String employee,
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Loan> loanPage;

        if (state != null && !state.isEmpty()) {
            try {
                LoanState enumState = LoanState.valueOf(state.toUpperCase().trim());
                loanPage = loanService.findByState(enumState, pageable);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(
                                "El estado proporcionado no es válido. Usa: ACTIVO, DEVUELTO.",
                                HttpStatus.BAD_REQUEST.value(),
                                null,
                                0, 0, 0, 0
                        )
                );
            }
        } else if (employee != null && !employee.isEmpty()) {
            loanPage = loanService.findByEmployee(employee, pageable);
        } else {
            loanPage = loanService.findAllPaged(pageable);
        }

        ApiResponse<Loan> response = new ApiResponse<>(
                "Préstamos filtrados correctamente",
                200,
                loanPage.getContent(),
                loanPage.getTotalElements(),
                loanPage.getTotalPages(),
                loanPage.getNumber(),
                loanPage.getSize()
        );

        return ResponseEntity.ok(response);
    }

}
