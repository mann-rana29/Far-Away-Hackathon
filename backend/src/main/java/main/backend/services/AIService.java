package main.backend.services;

import main.backend.dto.response.AIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class AIService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.fastapi.analyzeUrl}")
    private String url;

    public AIResponse fastApiService(MultipartFile image) throws  Exception{
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", new ByteArrayResource(compressImage(image.getBytes())) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        return restTemplate.postForObject(url, requestEntity, AIResponse.class);
    }

    private byte[] compressImage(byte[] imageBytes) throws Exception {
        BufferedImage original = ImageIO.read(new ByteArrayInputStream(imageBytes));

        int maxWidth = 640;
        int width = original.getWidth();
        int height = original.getHeight();

        if (width > maxWidth) {
            height = (int) ((double) height * maxWidth / width);
            width = maxWidth;
        }

        Image scaled = original.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        BufferedImage resized = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        resized.getGraphics().drawImage(scaled, 0, 0, null);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(resized, "jpg", out);
        return out.toByteArray();
    }
}
