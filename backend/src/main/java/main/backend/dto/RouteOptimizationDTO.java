package main.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RouteOptimizationDTO {
    private List<RouteComplaintDTO> complaints;
    private int total_vehicles;
}
