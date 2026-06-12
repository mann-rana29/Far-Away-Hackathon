package main.backend.controllers;
import main.backend.dto.response.WorkerDashboardResponse;
import main.backend.dto.response.WorkerProfileResponse;
import main.backend.security.CustomUserDetails;
import main.backend.services.VerificationService;
import main.backend.services.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/worker")
public class WorkerController {
    private final WorkerService workerService;
    private final VerificationService verificationService;

    public WorkerController(WorkerService workerService,VerificationService verificationService){
      this.workerService = workerService;
      this.verificationService = verificationService;
    }

    @GetMapping("/my-route")
    public ResponseEntity<?> myRoute(){
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                                                                            .getContext()
                                                                            .getAuthentication()
                                                                            .getPrincipal();
        return ResponseEntity.ok(workerService.getRoute(userDetails.getUser()));
    }

    @PostMapping("/verify/{complaintId}")
    public ResponseEntity<String> verify(@RequestParam MultipartFile image ,  @RequestParam Double lat, @RequestParam Double lon, @PathVariable Long complaintId){
        try{
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ResponseEntity.ok(verificationService.verifyImage(image,lat,lon ,complaintId,userDetails.getUser()));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/finish-route")
    public ResponseEntity<String> finishRoute(){
        try{
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ResponseEntity.ok(verificationService.finishRoute(userDetails.getUser()));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public WorkerDashboardResponse dashboard(){
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return workerService.workerDashboard(userDetails.getUser());
    }

    @GetMapping("/profile")
    public WorkerProfileResponse profile(){
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return workerService.workerProfile(userDetails.getUser());
    }

}
