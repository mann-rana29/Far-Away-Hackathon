package main.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardRouteDTO {
    private String formattedRouteId;
    private String vehicleNo;
    private String workerName;
}
