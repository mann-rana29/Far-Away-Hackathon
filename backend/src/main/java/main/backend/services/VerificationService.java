package main.backend.services;

import main.backend.dto.VerificationFastApiDTO;
import main.backend.dto.response.VerificationFastApiResponse;
import main.backend.enums.ComplaintStatus;
import main.backend.enums.RouteStatus;
import main.backend.models.*;
import main.backend.repositories.ComplaintRepository;
import main.backend.repositories.RouteRepository;
import main.backend.repositories.VehicleRepository;
import main.backend.repositories.VerificationRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;


@Service
public class VerificationService {
    private final VerificationRepository verificationRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final ComplaintRepository complaintRepository;
    private final CloudinaryService cloudinaryService;
    private final ExifService exifService;

    @Value("${spring.fastapi.verifyUrl}")
    private String url;

    @Autowired
    private RestTemplate restTemplate;

    public VerificationService(VerificationRepository verificationRepository, VehicleRepository vehicleRepository, RouteRepository routeRepository, ComplaintRepository complaintRepository, CloudinaryService cloudinaryService, ExifService exifService){
        this.verificationRepository = verificationRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.complaintRepository = complaintRepository;
        this.cloudinaryService = cloudinaryService;
        this.exifService = exifService;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // distance in meters
    }

    public String verifyImage(MultipartFile file, Double lat, Double lon, Long complaintId, User worker) throws Exception{
//        GeoLocation location = exifService.getGeoLocation(file);

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        double original_longitude = complaint.getLocation().getX();
        double original_latitude = complaint.getLocation().getY();

        double distance = calculateDistance(lat, lon, original_latitude, original_longitude);

        if(distance > 20){
            throw new RuntimeException("Worker is not at the complaint location");
        }

        String workerVerificationUrl = cloudinaryService.uploadImage(file);

        VerificationFastApiDTO request = new VerificationFastApiDTO(complaint.getImageUrl(), workerVerificationUrl);

        VerificationFastApiResponse response = restTemplate.postForObject(url,request,VerificationFastApiResponse.class);

        if(response.isCleaned()){
            GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(),4326);
            Point point = geometryFactory.createPoint(new Coordinate(lon,lat));
            Verification verification = Verification.builder()
                            .worker(worker)
                                    .notes(response.getReason())
                                            .complaint(complaint)
                                                    .verifiedImgUrl(workerVerificationUrl)
                                                            .trashFound(true)
                                                                    .verifiedLocation(point).build();

            verificationRepository.save(verification);

            complaint.setStatus(ComplaintStatus.CLEANED);
            complaintRepository.save(complaint);

            return "Verification completed";
        }
        return "Verification Failed because : " + response.getReason();
    }

    public String finishRoute(User worker){
        Vehicle vehicle = vehicleRepository.findByWorker(worker);

        if(vehicle == null) throw new RuntimeException("No vehicle assigned");

        Route route = routeRepository.findByVehicleAndRouteStatus(vehicle, RouteStatus.PENDING);

        if(route == null) throw new RuntimeException("No active route found");

        List<Complaint> routeComplaints = complaintRepository.findAllByRouteOrderBySequenceNoAsc(route);

        boolean allCleaned = routeComplaints.stream().allMatch(
                c -> c.getStatus() == ComplaintStatus.CLEANED
        );

        if(allCleaned){
            route.setRouteStatus(RouteStatus.COMPLETED);
            routeRepository.save(route);
            return "All complaints resolved";
        }

        return "All complaints are not resolved";
    }
}
