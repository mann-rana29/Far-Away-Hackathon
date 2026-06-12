package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.ComplaintStatus;
import main.backend.enums.TrashType;
import main.backend.enums.VolumeEstimate;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminComplaintResponse {
    private String formattedId;
    private TrashType trashType;
    private String location;
    private String citizenName;
    private int severityScore;
    private VolumeEstimate volumeEstimate;
    private ComplaintStatus complaintStatus;
    private String workerName;
    private LocalDateTime date;
}
