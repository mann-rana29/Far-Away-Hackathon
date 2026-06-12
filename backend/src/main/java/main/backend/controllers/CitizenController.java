package main.backend.controllers;

import main.backend.dto.response.CitizenComplaintsResponse;
import main.backend.dto.response.CitizenDashboardResponse;
import main.backend.dto.response.CitizenProfileResponse;
import main.backend.dto.response.ComplaintDetailResponse;
import main.backend.security.CustomUserDetails;
import main.backend.services.CitizenService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citizen")
public class CitizenController {
    private final CitizenService citizenService;

    public CitizenController(CitizenService citizenService){
        this.citizenService = citizenService;
    }

    @GetMapping("/dashboard")
    public CitizenDashboardResponse  citizenDashboard(){
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return citizenService.getDashboard(userDetails.getUser());
    }

    @GetMapping("/complaints")
    public List<CitizenComplaintsResponse> citizenComplaints(){
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return citizenService.myComplaints(userDetails.getUser());
    }

    @GetMapping("/profile")
    public CitizenProfileResponse citizenProfile(){
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return citizenService.getProfile(userDetails.getUser());
    }

    @GetMapping("/complaints/{complaintId}")
    public ComplaintDetailResponse citizenComplaintDetail(@PathVariable Long complaintId){
        return citizenService.complaintDetail(complaintId);
    }
}
