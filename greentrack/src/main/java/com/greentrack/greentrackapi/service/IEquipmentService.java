package com.greentrack.greentrackapi.service;

import com.greentrack.greentrackapi.entity.Equipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

public interface IEquipmentService {
    List<Equipment> findAll();
    Page<Equipment> findAllPaged(Pageable pageable);
    Equipment findById(Long id);
    Equipment save(Equipment equipment);
    Equipment update(Long id, Equipment equipment);
    void delete(Long id);
    Page<Equipment> findByType(String type, Pageable pageable);
    Page<Equipment> findByBrand(String brand, Pageable pageable);
    Map<String, Long> getEquipmentCounts();

}
