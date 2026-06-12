package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WorkerProfileResponse {
    private String name;
    private String workerId;
    private String phoneNo;
    private String assignedVehicleNo;
    private int totalCompletedRoutes;
    private int totalVerifications;

}
