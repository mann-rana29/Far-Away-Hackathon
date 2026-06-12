package main.backend.controllers;

import main.backend.dto.VehicleDTO;
import main.backend.services.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class VehicleController {
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService){
        this.vehicleService = vehicleService;
    }

    @PostMapping("/registerVehicle")
    public ResponseEntity<String> registerVehicle(@RequestBody VehicleDTO vehicleDTO){
        try{
            String result = vehicleService.addVehicle(vehicleDTO);
            return ResponseEntity.ok(result);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
