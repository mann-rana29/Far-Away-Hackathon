package main.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.VehicleStatus;

@Data
@AllArgsConstructor
public class VehicleDTO {
    private Long workerId;
    private String vehicleNo;
    private VehicleStatus vehicleStatus;
}
