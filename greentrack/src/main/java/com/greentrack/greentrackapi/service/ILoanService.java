package com.greentrack.greentrackapi.service;

import com.greentrack.greentrackapi.entity.Equipment;
import com.greentrack.greentrackapi.entity.Loan;
import com.greentrack.greentrackapi.entity.LoanState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ILoanService {
    List<Loan> findAll();
    Page<Loan> findAllPaged(Pageable pageable);
    Loan findById(Long id);
    Loan save(Loan loan);
    Loan update(Long id, Loan loan);
    void delete(Long id);
    Loan markAsReturned(Long id);
    Page<Loan> findByEmployee(String employee, Pageable pageable);
    Page<Loan> findByState(LoanState state, Pageable pageable);
}
