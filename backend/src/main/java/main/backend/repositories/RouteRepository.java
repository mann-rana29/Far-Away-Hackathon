package main.backend.repositories;

import main.backend.enums.RouteStatus;
import main.backend.models.Route;
import main.backend.models.User;
import main.backend.models.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Route findByVehicleAndRouteStatus(Vehicle vehicle, RouteStatus routeStatus);

    List<Route> findAllByRouteStatus(RouteStatus routeStatus);

    Route findByWorker(User worker);

    int countByWorkerAndRouteStatus(User worker, RouteStatus routeStatus);

}
