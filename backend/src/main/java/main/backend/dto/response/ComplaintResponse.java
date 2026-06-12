package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.ComplaintStatus;

@Data
@AllArgsConstructor
public class ComplaintResponse {
    private double latitude;
    private double longitude;
    private String imageUrl;
    private ComplaintStatus complaintStatus;
    private double severityScore;
}
