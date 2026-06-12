package main.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerificationFastApiResponse {
    private boolean isCleaned;
    private String reason;
}
