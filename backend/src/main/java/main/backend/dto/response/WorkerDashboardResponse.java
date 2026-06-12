package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.dto.WorkerComplaintDTO;
import main.backend.enums.RouteStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class WorkerDashboardResponse {
    private String name;
    private String formattedRouteId;
    private List<WorkerComplaintDTO> assignedComplaints;
    private int completedComplaints;
    private int pendingComplaints;
    private String vehicleNo;
    private RouteStatus routeStatus;
    private LocalDateTime createdAt;
}
