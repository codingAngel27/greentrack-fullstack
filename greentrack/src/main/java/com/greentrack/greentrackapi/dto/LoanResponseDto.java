package com.greentrack.greentrackapi.dto;

import com.greentrack.greentrackapi.entity.LoanState;
import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class LoanResponseDto {
    private Long id;
    private String employee;
    private String equipmentName;
    private Long equipmentId;
    private LocalDateTime dateLoan;
    private LocalDateTime dateReturn;
    private LoanState  state;
}
