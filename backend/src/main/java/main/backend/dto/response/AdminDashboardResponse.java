package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.dto.AdminDashboardComplaintDTO;
import main.backend.dto.AdminDashboardRouteDTO;

import java.util.List;

@Data
@AllArgsConstructor
public class AdminDashboardResponse {
    private String name;
    private int totalComplaints;
    private int totalWorkers;
    private int totalCitizens;
    private int totalPendingComplaints;
    private int totalActiveVehicles;
    private int totalVehicles;
    private int efficiency;
    private List<AdminDashboardRouteDTO> activeRoutes;
    private List<AdminDashboardComplaintDTO> recentComplaints;
}
