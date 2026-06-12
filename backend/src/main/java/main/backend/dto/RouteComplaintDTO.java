package main.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouteComplaintDTO {
    private long id;
    private double latitude;
    private double longitude;
}
