package main.backend.controllers;

import main.backend.services.RouteOptimizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/routes")
public class RouteController {
    private final RouteOptimizationService routeOptimizationService;

    public RouteController(RouteOptimizationService routeOptimizationService){
        this.routeOptimizationService = routeOptimizationService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<String> optimizeRoutes(){
        String result = routeOptimizationService.optimize();
        return ResponseEntity.ok(result);
    }
}