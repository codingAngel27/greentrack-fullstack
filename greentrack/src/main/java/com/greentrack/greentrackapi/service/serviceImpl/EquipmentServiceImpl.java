package com.greentrack.greentrackapi.service.serviceImpl;

import com.greentrack.greentrackapi.entity.Equipment;
import com.greentrack.greentrackapi.entity.EquipmentState;
import com.greentrack.greentrackapi.exception.BadRequestException;
import com.greentrack.greentrackapi.exception.ResourceNotFoundException;
import com.greentrack.greentrackapi.repository.IEquipmentRepository;
import com.greentrack.greentrackapi.service.IEquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EquipmentServiceImpl implements IEquipmentService {


    @Autowired
    private IEquipmentRepository equipmentRepository;

    @Override
    public List<Equipment> findAll() {
        return equipmentRepository.findAll();
    }

    @Override
    public Page<Equipment> findAllPaged(Pageable pageable) {
        return equipmentRepository.findAll(pageable);
    }

    @Override
    public Equipment findById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + id));
    }

    @Override
    public Equipment save(Equipment equipment) {
        // Validar si ya existe un equipo con el mismo nombre
        if (equipmentRepository.findByName(equipment.getName()).isPresent()) {
            throw new BadRequestException("Ya existe un equipo con el nombre: " + equipment.getName());
        }
        return equipmentRepository.save(equipment);
    }

    @Override
    public Equipment update(Long id, Equipment equipment) {
        Equipment existing = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + id));

        // Validar nombre duplicado
        equipmentRepository.findByName(equipment.getName())
                .filter(e -> !e.getId().equals(id))
                .ifPresent(e -> {
                    throw new BadRequestException("Ya existe un equipo con el nombre: " + equipment.getName());
                });

        existing.setName(equipment.getName());
        existing.setType(equipment.getType());
        existing.setBrand(equipment.getBrand());
        existing.setState(equipment.getState());

        return equipmentRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        Equipment existing = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipo no encontrado con id: " + id));

        equipmentRepository.delete(existing);
    }


    @Override
    public Page<Equipment> findByType(String type, Pageable pageable) {
        return equipmentRepository.findByTypeContainingIgnoreCase(type, pageable);
    }

    @Override
    public Page<Equipment> findByBrand(String brand, Pageable pageable) {
        return equipmentRepository.findByBrandContainingIgnoreCase(brand, pageable);
    }
    @Override
    public Map<String, Long> getEquipmentCounts() {
        long disponibles = equipmentRepository.countByState(EquipmentState.DISPONIBLE);
        long prestados = equipmentRepository.countByState(EquipmentState.PRESTADO);
        return Map.of("disponibles", disponibles, "prestados", prestados);
    }

}
