package com.greentrack.greentrackapi.repository;

import com.greentrack.greentrackapi.entity.Loan;
import com.greentrack.greentrackapi.entity.LoanState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ILoanRepository extends JpaRepository<Loan, Long> {

    Page<Loan> findByEmployeeContainingIgnoreCase(String employee, Pageable pageable);

    Page<Loan> findByState(LoanState state, Pageable pageable);

}
