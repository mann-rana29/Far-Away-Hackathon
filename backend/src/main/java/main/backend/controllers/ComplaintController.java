package main.backend.controllers;

import main.backend.dto.response.ComplaintResponse;
import main.backend.models.Complaint;
import main.backend.security.CustomUserDetails;
import main.backend.services.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class ComplaintController {
    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService){
        this.complaintService = complaintService;
    }

    @PostMapping("/citizen/complaint")
    public ResponseEntity<String> complaint(
            @RequestParam MultipartFile image, @RequestParam Double lat , @RequestParam Double lon
            ) throws  Exception{
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                                                                                .getAuthentication()
                                                                                .getPrincipal();
        return ResponseEntity.ok(complaintService.registerComplaint(image , lat, lon,userDetails));
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping(){
        return ResponseEntity.ok("Pong");
    }

    @GetMapping("/heatmap")
    public List<ComplaintResponse> heatmap(){
        return complaintService.findAllActiveComplaints();
    }
}
