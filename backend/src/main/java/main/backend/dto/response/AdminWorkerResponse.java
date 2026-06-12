package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminWorkerResponse {
    private String workerId;
    private String workerName;
    private String phoneNo;
    private String vehicleNo;
}
