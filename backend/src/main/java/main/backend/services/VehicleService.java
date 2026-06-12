package main.backend.services;

import main.backend.dto.VehicleDTO;
import main.backend.models.User;
import main.backend.models.Vehicle;
import main.backend.repositories.UserRepository;
import main.backend.repositories.VehicleRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleService(VehicleRepository vehicleRepository , UserRepository userRepository){
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public String addVehicle(VehicleDTO vehicleDTO){

        User worker = userRepository.findById(vehicleDTO.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        Vehicle vehicle = Vehicle.builder()
                .worker(worker)
                .vehicleNo(vehicleDTO.getVehicleNo())
                .vehicleStatus(vehicleDTO.getVehicleStatus())
                .build();

        vehicleRepository.save(vehicle);
        return "Vehicle added successfully";
    }


}
