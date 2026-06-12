package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import main.backend.dto.RouteResultDTO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteOptimizationResponse {
    private List<RouteResultDTO> routes;
}
