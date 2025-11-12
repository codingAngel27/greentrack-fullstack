package com.greentrack.greentrackapi.controller;

import com.greentrack.greentrackapi.dto.ApiResponse;
import com.greentrack.greentrackapi.entity.Equipment;
import com.greentrack.greentrackapi.entity.EquipmentState;
import com.greentrack.greentrackapi.entity.Loan;
import com.greentrack.greentrackapi.service.serviceImpl.EquipmentServiceImpl;
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

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/equipments")
@Api(tags = "Equipos", description = "Crud de la entidad equipo")
public class EquipmentController {

    @Autowired
    private EquipmentServiceImpl equipmentService;

    /**
     * Lista todos los equipos - sin paginación
     */
    @ApiOperation(value = "Listar todos los equipos sin paginación")
    @GetMapping
    public ResponseEntity<ApiResponse<Equipment>> getAll() {
        List<Equipment> equipments = equipmentService.findAll();

        ApiResponse<Equipment> response = new ApiResponse<>(
                "Lista de equipos obtenida correctamente",
                HttpStatus.OK.value(),
                equipments,
                equipments.size(),
                1,
                1,
                equipments.size()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Lista con paginación
     */
    @ApiOperation(value = "Listar todos los equipos con paginación")
    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Equipment>> getEquipmentsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Equipment> pageResult = equipmentService.findAllPaged(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        );

        ApiResponse<Equipment> response = new ApiResponse<>(
                "Equipos paginados obtenidos correctamente",
                HttpStatus.OK.value(),
                pageResult.getContent(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getNumber(),
                pageResult.getSize()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene equipo por ID
     */
    @ApiOperation(value = "Obtiene Equipo por el ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Equipment>> getById(@PathVariable Long id) {
        Equipment equipment = equipmentService.findById(id);

        ApiResponse<Equipment> response = new ApiResponse<>(
                "Equipo encontrado correctamente",
                HttpStatus.OK.value(),
                List.of(equipment),
                1,
                1,
                1,
                1
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Crea un nuevo equipo
     */
    @ApiOperation(value = "Crea un nuevo Equipo")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Equipment>> create(@Valid @RequestBody Equipment equipment) {
        Equipment saved = equipmentService.save(equipment);

        ApiResponse<Equipment> response = new ApiResponse<>(
                "Equipo creado correctamente",
                HttpStatus.CREATED.value(),
                List.of(saved),
                1,
                1,
                1,
                1
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Actualiza un equipo
     */
    @ApiOperation(value = "Actualiza un equipo los atributos empleado, equipo y fecha de devolución")
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<Equipment>> update(
            @PathVariable Long id,
            @Valid @RequestBody Equipment equipment) {

        Equipment updated = equipmentService.update(id, equipment);

        ApiResponse<Equipment> response = new ApiResponse<>(
                "Equipo actualizado correctamente",
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
     * Elimina un equipo
     */
    @ApiOperation(value = "Elimina un equipo si esta si disponible")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        Equipment equipment = equipmentService.findById(id);

        if (equipment.getState() == EquipmentState.PRESTADO) {
            ApiResponse<Void> response = new ApiResponse<>(
                    "No se puede eliminar un equipo que está prestado",
                    HttpStatus.CONFLICT.value(), // 409 Conflict
                    null,
                    0,
                    0,
                    0,
                    0
            );
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        equipmentService.delete(id);

        ApiResponse<Void> response = new ApiResponse<>(
                "Equipo eliminado correctamente",
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
     * Filtra por Tipo o Marca
     */
    @ApiOperation(value = "Filtra por tipo o marca")
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<Equipment>> filterEquipment(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Equipment> equipmentPage;

        if (type != null && !type.isEmpty()) {
            equipmentPage = equipmentService.findByType(type, pageable);
        } else if (brand != null && !brand.isEmpty()) {
            equipmentPage = equipmentService.findByBrand(brand, pageable);
        } else {
            equipmentPage = equipmentService.findAllPaged(pageable); // opcional
        }

        ApiResponse<Equipment> response = new ApiResponse<>(
                "Equipos filtrados correctamente",
                200,
                equipmentPage.getContent(),
                equipmentPage.getTotalElements(),
                equipmentPage.getTotalPages(),
                equipmentPage.getNumber(),
                equipmentPage.getSize()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Contador de equipos prestados
     */
    @ApiOperation(value = "Lista cuantos equipos están disponibles y prestados")
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCounts() {
        return ResponseEntity.ok(equipmentService.getEquipmentCounts());
    }
}
