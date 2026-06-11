package main.backend.repositories;

import main.backend.models.Complaint;
import main.backend.models.User;
import main.backend.models.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationRepository  extends JpaRepository<Verification, Long> {
    int countByWorker(User worker);
    Verification findByComplaint(Complaint complaint);
}
