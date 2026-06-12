package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CitizenDashboardResponse{
    private int complaintResolvedPercentage;
    private int totalComplaints;
    private int resolvedComplaints;
    private int pendingComplaints;
    private String name;
    private List<CitizenComplaintsResponse> complaints;
}
