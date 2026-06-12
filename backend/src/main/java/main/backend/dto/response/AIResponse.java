package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import main.backend.enums.TrashType;
import main.backend.enums.VolumeEstimate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIResponse {
    private Boolean trashDetected;

    private Boolean isFake;

    private Boolean isIndoor;

    private TrashType trashType;

    private VolumeEstimate volumeEstimate;

    private String aiAnalysis;

    private Double severityScore;
}