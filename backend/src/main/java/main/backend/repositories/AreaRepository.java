package main.backend.repositories;

import main.backend.models.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {

    @Query(value = "SELECT location_name FROM areas ORDER BY geom <-> ST_SetSRID(ST_MakePoint(:lon, :lat),4326) LIMIT 1", nativeQuery = true)
    Optional<String> findNearestLocation(@Param("lat") double lat, @Param("lon") double lon);
}
