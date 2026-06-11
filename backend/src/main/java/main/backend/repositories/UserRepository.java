package main.backend.repositories;

import main.backend.enums.Role;
import main.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository  extends JpaRepository<User, Long> {
    Optional<User> findByPhone(String phone);

    boolean existsByPhone(String phone);

    List<User> findAllByRole(Role role);

    int countByRole(Role role);
}
