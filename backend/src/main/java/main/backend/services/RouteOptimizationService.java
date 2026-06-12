package main.backend.services;

import main.backend.dto.RouteComplaintDTO;
import main.backend.dto.RouteOptimizationDTO;
import main.backend.dto.response.RouteOptimizationResponse;
import main.backend.dto.RouteResultDTO;
import main.backend.enums.ComplaintStatus;
import main.backend.enums.RouteStatus;
import main.backend.enums.VehicleStatus;
import main.backend.models.Complaint;
import main.backend.models.Route;
import main.backend.models.Vehicle;
import main.backend.repositories.ComplaintRepository;
import main.backend.repositories.RouteRepository;
import main.backend.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RouteOptimizationService {
    private final ComplaintRepository complaintRepository;
    private final RouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.fastapi.routeUrl}")
    private String url;

    public RouteOptimizationService(ComplaintRepository complaintRepository, RouteRepository routeRepository, VehicleRepository vehicleRepository){
        this.complaintRepository = complaintRepository;
        this.routeRepository = routeRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public RouteOptimizationDTO buildOptimizationInput(){
        List<Complaint> complaints = complaintRepository.findAll();
        int total_vehicles = (int) vehicleRepository.count();

        List<RouteComplaintDTO> routeComplaintDTOS = complaints.stream().map(
                complaint -> new RouteComplaintDTO(
                        complaint.getId(),
                        complaint.getLocation().getY(),
                        complaint.getLocation().getX()
                )
        ).collect(Collectors.toList());

        return new RouteOptimizationDTO(routeComplaintDTOS, total_vehicles);
    }

    public RouteOptimizationResponse getRoutes(RouteOptimizationDTO input){

        return restTemplate.postForObject(url,input,RouteOptimizationResponse.class);
    }

    public String optimize(){
        try{
            RouteOptimizationDTO routeOptimizationDTO = buildOptimizationInput();
            if(routeOptimizationDTO.getComplaints().isEmpty() || routeOptimizationDTO.getTotal_vehicles() == 0){
                return "No complaints or vehicles found";
            }
            RouteOptimizationResponse response = getRoutes(routeOptimizationDTO);

            List<Vehicle> vehicles = vehicleRepository.findAllByVehicleStatus(VehicleStatus.ACTIVE);

            for(RouteResultDTO routeResult : response.getRoutes()){
                Vehicle vehicle = vehicles.get(routeResult.getCluster_id());

                Route route = Route.builder()
                        .vehicle(vehicle)
                        .worker(vehicle.getWorker())
                        .routeStatus(RouteStatus.PENDING)
                        .build();

                routeRepository.save(route);

                List<Long> complaintIds = routeResult.getComplaint_ids().stream()
                        .map(id -> Long.valueOf(id))
                        .collect(Collectors.toList());

                List<Complaint> complaints = complaintRepository.findAllById(complaintIds);

                Map<Long, Complaint> complaintMap = complaints.stream()
                        .collect(Collectors.toMap(Complaint::getId, c -> c));


                for (int i = 0; i < complaintIds.size(); i++) {
                    Complaint complaint = complaintMap.get(complaintIds.get(i));
                    if (complaint != null) {
                        complaint.setRoute(route);
                        complaint.setStatus(ComplaintStatus.ASSIGNED);
                        complaint.setSequenceNo(i + 1);
                        complaint.setVehicle(vehicle);
                    }
                }

                complaintRepository.saveAll(complaints);
            }

            return "routes optimized successfully";

        }
        catch(ResourceAccessException e){
            return "FastAPI service is unavailable";
        }
        catch (HttpClientErrorException e){
            return "Error from fastapi : " + e.getMessage();
        }
    }
}
