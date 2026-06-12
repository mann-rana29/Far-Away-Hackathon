package main.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouteStopsDTO {
    private String complaintId;
    private int sequenceNo;
    private double latitude;
    private double longitude;
}
