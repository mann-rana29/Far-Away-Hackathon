package main.backend.models;

import jakarta.persistence.*;
import lombok.*;
import main.backend.enums.VehicleStatus;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY )
    @JoinColumn(name = "worker_id",unique = true)
    private User worker;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VehicleStatus vehicleStatus = VehicleStatus.ACTIVE;

    @Column(nullable = false)
    private String vehicleNo;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;
}
