package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.dto.RouteStopsDTO;

import java.util.List;

@Data
@AllArgsConstructor
public class AdminRouteResponse {
    private Long id;
    private String formattedId;
    private String vehicleNo;
    private String workerName;
    private List<RouteStopsDTO> stops;
}
