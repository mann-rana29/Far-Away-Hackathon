package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.backend.enums.Role;

@Data
@AllArgsConstructor
public class CitizenProfileResponse {
    private String name;
    private Role role;
    private String phoneNo;
    private String formattedId;
}
