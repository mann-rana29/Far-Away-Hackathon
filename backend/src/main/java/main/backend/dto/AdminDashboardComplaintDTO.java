package main.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.ComplaintStatus;
import main.backend.enums.TrashType;
import main.backend.enums.VolumeEstimate;

@Data
@AllArgsConstructor
public class AdminDashboardComplaintDTO {
    private TrashType trashType;
    private VolumeEstimate volumeEstimate;
    private String location;
    private ComplaintStatus complaintStatus;
    private int severityScore;
}
