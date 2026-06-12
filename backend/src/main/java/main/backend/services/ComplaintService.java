package main.backend.services;

import main.backend.dto.response.AIResponse;
import main.backend.dto.response.ComplaintResponse;
import main.backend.enums.ComplaintStatus;
import main.backend.models.Complaint;
import main.backend.models.GeoLocation;
import main.backend.models.User;
import main.backend.repositories.ComplaintRepository;
import main.backend.security.CustomUserDetails;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final CloudinaryService cloudinaryService;
    private final ExifService exifService;
    private final AIService aiService;

    public ComplaintService(ComplaintRepository complaintRepository , AIService aiService, CloudinaryService cloudinaryService, ExifService exifService){
        this.complaintRepository = complaintRepository;
        this.aiService = aiService;
        this.cloudinaryService = cloudinaryService;
        this.exifService = exifService;
    }

    public String registerComplaint(MultipartFile image , Double lat , Double lon ,CustomUserDetails userDetails) throws  Exception{

//        GeoLocation geoLocation = exifService.getGeoLocation(image);
        AIResponse aiResponse = aiService.fastApiService(image);

        if(!aiResponse.getTrashDetected()){
            return "Trash not detected";
        }
        else if(aiResponse.getIsIndoor()){
            return "Trash is found indoor";
        }
        else if(aiResponse.getIsFake()){
            return "Image is fake";
        }else {
            String url = cloudinaryService.uploadImage(image);
            GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(),4326);
            Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
            User user = userDetails.getUser();

            Complaint complaint = Complaint.builder().user(user)

                        .location(point)
                        .imageUrl(url)
                        .status(ComplaintStatus.PENDING)
                        .severityScore(aiResponse.getSeverityScore())
                        .trashType(aiResponse.getTrashType())
                        .aiAnalysis(aiResponse.getAiAnalysis())
                        .volumeEstimate(aiResponse.getVolumeEstimate())
                        .build();
                complaintRepository.save(complaint);
                return "Complaint Registered Successfully!";
        }
    }

    @Transactional
    public List<ComplaintResponse> findAllActiveComplaints(){
        List<Complaint> complaints = complaintRepository.findAllByStatusNot(ComplaintStatus.CLEANED);

        return complaints.stream().map(
              complaint ->  new ComplaintResponse(complaint.getLocation().getY(),
                                                            complaint.getLocation().getX(),
                                                            complaint.getImageUrl(),
                                                            complaint.getStatus(),
                                                            complaint.getSeverityScore()
                      )
        ).toList();
    }
}
