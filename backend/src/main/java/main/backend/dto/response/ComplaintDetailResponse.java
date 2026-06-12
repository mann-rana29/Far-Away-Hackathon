package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.ComplaintStatus;
import main.backend.enums.TrashType;
import main.backend.enums.VolumeEstimate;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ComplaintDetailResponse {
    private String complaintId;
    private ComplaintStatus complaintStatus;
    private TrashType trashType;
    private VolumeEstimate volumeEstimate;
    private double severityScore;
    private LocalDateTime createdAt;
    private String location;
    private String imageUrl;
    private String cleanedImageUrl;
    private String aiAnalysis;
    private String workerName;
}
