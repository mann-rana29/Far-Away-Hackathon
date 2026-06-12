package main.backend.services;

import main.backend.dto.AdminDashboardComplaintDTO;
import main.backend.dto.AdminDashboardRouteDTO;
import main.backend.dto.RouteStopsDTO;
import main.backend.dto.response.*;
import main.backend.enums.ComplaintStatus;
import main.backend.enums.Role;
import main.backend.enums.RouteStatus;
import main.backend.enums.VehicleStatus;
import main.backend.models.Complaint;
import main.backend.models.Route;
import main.backend.models.User;
import main.backend.repositories.ComplaintRepository;
import main.backend.repositories.RouteRepository;
import main.backend.repositories.UserRepository;
import main.backend.repositories.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final RouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;
    private final AreaService areaService;

    public AdminService(UserRepository userRepository, AreaService areaService, ComplaintRepository complaintRepository, RouteRepository routeRepository, VehicleRepository vehicleRepository){
        this.complaintRepository = complaintRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.userRepository = userRepository;
        this.areaService = areaService;
    }

    @Transactional
    public AdminDashboardResponse getDashboard(User admin){

        int efficiency = complaintRepository.count() == 0? 0 :  (complaintRepository.countByStatus(ComplaintStatus.CLEANED) * 100) / (int) complaintRepository.count();

        List<Route> routes = routeRepository.findAllByRouteStatus(RouteStatus.PENDING).stream().limit(5).toList();

        List<Complaint> complaints = complaintRepository.findAllOrderByCreatedAtDesc().stream().limit(5).toList();

        return new AdminDashboardResponse(
                admin.getName(),
                (int)complaintRepository.count(),
                userRepository.countByRole(Role.WORKER),
                userRepository.countByRole(Role.CITIZEN),
                complaintRepository.countByStatus(ComplaintStatus.PENDING),
                vehicleRepository.countByVehicleStatus(VehicleStatus.ACTIVE),
                (int)vehicleRepository.count(),
                efficiency,
                routes.stream().map(
                        r -> new AdminDashboardRouteDTO(
                                "RT-" + r.getId(),
                                r.getVehicle() != null ? r.getVehicle().getVehicleNo() : "Unassigned",
                                r.getWorker() != null ? r.getWorker().getName() : "Unassigned"
                        )
                ).toList(),
                complaints.stream().map(
                        c -> new AdminDashboardComplaintDTO(
                                c.getTrashType(),
                                c.getVolumeEstimate(),
                                areaService.getLocation(c.getLocation().getY(), c.getLocation().getX()),
                                c.getStatus(),
                                (int) c.getSeverityScore()
                        )
                ).toList()
        );
    }

    @Transactional
    public List<AdminRouteResponse> getRoutes(){
        List<Route> routes = routeRepository.findAllByRouteStatus(RouteStatus.PENDING);

        return routes.stream().map(
                r -> new AdminRouteResponse(
                        r.getId(),
                        "RT-" + r.getId(),
                        r.getVehicle() != null ? r.getVehicle().getVehicleNo() : "Unassigned",
                        r.getWorker() != null ? r.getWorker().getName() : "Unassigned",
                        complaintRepository.findAllByRouteOrderBySequenceNoAsc(r).stream().map(
                                c -> new RouteStopsDTO(
                                        "CMP-" + c.getId(),
                                        c.getSequenceNo(),
                                        c.getLocation().getY(),
                                        c.getLocation().getX()
                                )
                        ).toList()
                )
        ).toList();
    }

    @Transactional
    public List<AdminComplaintResponse> getComplaints(){
        return complaintRepository.findAll().stream().map(
                c-> new AdminComplaintResponse(
                        "CMP-" + c.getId(),
                        c.getTrashType(),
                        areaService.getLocation(c.getLocation().getY(),c.getLocation().getX()),
                        c.getUser().getName(),
                        (int)c.getSeverityScore(),
                        c.getVolumeEstimate(),
                        c.getStatus(),
                        c.getVehicle() != null && c.getVehicle().getWorker() != null
                                ? c.getVehicle().getWorker().getName()
                                : "Unassigned",
                        c.getCreatedAt()
                )
        ).toList();
    }

    @Transactional
    public List<AdminVehicleResponse> getVehicles(){
        return vehicleRepository.findAll().stream().map(
                v -> new AdminVehicleResponse(
                        "VH-" + v.getId(),
                        v.getVehicleNo(),
                        v.getVehicleStatus(),
                        v.getWorker().getName()
                )
        ).toList();
    }

    @Transactional
    public List<AdminWorkerResponse> getWorkers(){

        return userRepository.findAllByRole(Role.WORKER).stream().map(
                w -> new AdminWorkerResponse(
                        "EMP-" + w.getWorkerId(),
                        w.getName(),
                        w.getPhone(),
                        vehicleRepository.findByWorker(w) != null
                                ? vehicleRepository.findByWorker(w).getVehicleNo()
                                : "Unassigned"
                )
        ).toList();
    }
}
