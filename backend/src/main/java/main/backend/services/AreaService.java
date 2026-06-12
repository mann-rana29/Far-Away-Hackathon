package main.backend.services;

import main.backend.repositories.AreaRepository;
import org.springframework.stereotype.Service;

@Service
public class AreaService {
    private final AreaRepository areaRepository;

    public AreaService(AreaRepository areaRepository){
        this.areaRepository = areaRepository;
    }

    public String getLocation(double lat, double lon){
        return areaRepository.findNearestLocation(lat, lon).orElse("Unknown Area");
    }
}
