package main.backend.services;

import main.backend.dto.WorkerComplaintDTO;
import main.backend.dto.response.WorkerComplaintResponse;
import main.backend.dto.response.WorkerDashboardResponse;
import main.backend.dto.response.WorkerProfileResponse;
import main.backend.enums.ComplaintStatus;
import main.backend.enums.RouteStatus;
import main.backend.models.Complaint;
import main.backend.models.Route;
import main.backend.models.User;
import main.backend.models.Vehicle;
import main.backend.repositories.ComplaintRepository;
import main.backend.repositories.RouteRepository;
import main.backend.repositories.VehicleRepository;
import main.backend.repositories.VerificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerService {
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final ComplaintRepository complaintRepository;
    private final VerificationRepository verificationRepository;
    private final AreaService areaService;

    public WorkerService(VehicleRepository vehicleRepository, VerificationRepository verificationRepository, AreaService areaService, RouteRepository routeRepository, ComplaintRepository complaintRepository){
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.complaintRepository = complaintRepository;
        this.areaService = areaService;
        this.verificationRepository = verificationRepository;
    }

    public List<WorkerComplaintResponse> getRoute(User worker){
        Vehicle vehicle = vehicleRepository.findByWorker(worker);

        if(vehicle == null) throw new RuntimeException("Vehicle not assigned");

        Route route = routeRepository.findByVehicleAndRouteStatus(vehicle, RouteStatus.PENDING);

        if(route == null) throw new RuntimeException("Route not assigned");

        List<Complaint> complaints = complaintRepository.findAllByRouteOrderBySequenceNoAsc(route);

        List<WorkerComplaintResponse> workerComplaintResponses =complaints.stream().map(
                 complaint -> new WorkerComplaintResponse(
                         complaint.getId(),
                         complaint.getLocation().getY(),
                         complaint.getLocation().getX(),
                         areaService.getLocation(complaint.getLocation().getY(), complaint.getLocation().getX()),
                         complaint.getImageUrl(),
                         complaint.getStatus(),
                         complaint.getSequenceNo(),
                         (int) complaint.getSeverityScore()
                 )
        ).toList();

        return workerComplaintResponses;
    }

    public WorkerDashboardResponse workerDashboard(User worker){
        Vehicle vehicle = vehicleRepository.findByWorker(worker);
        if(vehicle == null) {
            return new WorkerDashboardResponse(
                    worker.getName(),
                    null,
                    List.of(),
                    0,
                    0,
                    "unassigned",
                    null,
                    null
            );
        }

        Route route = routeRepository.findByWorker(worker);
        if(route == null) {
            return new WorkerDashboardResponse(
                    worker.getName(),
                    null,
                    List.of(),
                    0,
                    0,
                    vehicle.getVehicleNo(),
                    null,
                    null
            );
        }

        int pendingComplaints = complaintRepository.countByRouteAndStatus(route, ComplaintStatus.ASSIGNED);
        int completedComplaints = complaintRepository.countByRouteAndStatus(route, ComplaintStatus.CLEANED);

        List<WorkerComplaintDTO> complaintDTOS = complaintRepository.findAllByRouteOrderBySequenceNoAsc(route)
                .stream().map(
                        c-> new WorkerComplaintDTO(
                                "CMP-" + c.getId(),
                                c.getTrashType(),
                                areaService.getLocation(c.getLocation().getY(),c.getLocation().getX()),
                                c.getVolumeEstimate()
                        )
                ).toList();

        return new WorkerDashboardResponse(
                worker.getName(),
                "RT-" + route.getId(),
                complaintDTOS,
                completedComplaints,
                pendingComplaints,
                vehicle.getVehicleNo(),
                route.getRouteStatus(),
                route.getCreatedAt()
        );
    }

    public WorkerProfileResponse workerProfile(User worker){

        Vehicle vehicle = vehicleRepository.findByWorker(worker);

        if(vehicle == null) throw new RuntimeException("Vehicle not assigned");

        return new WorkerProfileResponse(
                worker.getName(),
                "EMP-" + worker.getWorkerId(),
                worker.getPhone(),
                vehicle.getVehicleNo(),
                routeRepository.countByWorkerAndRouteStatus(worker,RouteStatus.COMPLETED),
                verificationRepository.countByWorker(worker)
        );
    }
}
