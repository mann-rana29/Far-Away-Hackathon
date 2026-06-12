package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.VehicleStatus;

@Data
@AllArgsConstructor
public class AdminVehicleResponse {
    private String vehicleId;
    private String vehicleNo;
    private VehicleStatus vehicleStatus;
    private String workerName;
}
