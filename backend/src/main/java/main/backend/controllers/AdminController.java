package main.backend.controllers;

import main.backend.dto.request.RegisterRequest;
import main.backend.dto.response.*;
import main.backend.security.CustomUserDetails;
import main.backend.services.AdminService;
import main.backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    private final AuthService authService;

    public AdminController(AdminService adminService, AuthService authService){
        this.adminService = adminService;
        this.authService = authService;
    }


    @PostMapping("/registerWorker")
    public ResponseEntity<String> registerWorker(@RequestBody RegisterRequest registerRequest){
        try{
            String message = authService.registerWorker(registerRequest);
            return ResponseEntity.ok(message);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard(){
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return adminService.getDashboard(userDetails.getUser());
    }

    @GetMapping("/complaints")
    public List<AdminComplaintResponse> complaints(){
        return adminService.getComplaints();
    }

    @GetMapping("/workers")
    public List<AdminWorkerResponse> workers(){
        return adminService.getWorkers();
    }

    @GetMapping("/vehicles")
    public List<AdminVehicleResponse> vehicles(){
        return adminService.getVehicles();
    }

    @GetMapping("/routes")
    public List<AdminRouteResponse> routes(){
        return adminService.getRoutes();
    }
}
