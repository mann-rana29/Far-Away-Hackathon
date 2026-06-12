package main.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.TrashType;
import main.backend.enums.VolumeEstimate;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class WorkerComplaintDTO {
    private String formattedComplaintId;
    private TrashType trashType;
    private String location;
    private VolumeEstimate volumeEstimate;
}
