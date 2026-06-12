package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.ComplaintStatus;
import main.backend.enums.TrashType;
import main.backend.enums.VolumeEstimate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CitizenComplaintsResponse {
    private Long complaintId;
    private String formattedId;
    private ComplaintStatus complaintStatus;
    private TrashType trashType;
    private VolumeEstimate volumeEstimate;
    private int severityScore;
    private LocalDateTime createdAt;
    private String location;
}
