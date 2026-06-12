package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.ComplaintStatus;

@Data
@AllArgsConstructor
public class WorkerComplaintResponse {
        private Long id;
        private double latitude;
        private double longitude;
        private String location;
        private String imageUrl;
        private ComplaintStatus status;
        private int sequenceNo;
        private int severityScore;
}
