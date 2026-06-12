package main.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerificationFastApiDTO {
    @JsonProperty("original_img_url")
    private String originalComplaintUrl;

    @JsonProperty("cleaned_img_url")
    private String workerVerificationUrl;
}
