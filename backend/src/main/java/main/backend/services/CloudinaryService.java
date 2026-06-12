package main.backend.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary){
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile multipartFile) throws IOException {
        var image = multipartFile.getBytes();

        Map params = ObjectUtils.asMap(
                "folder", "chokho",
                "use_filename", true,
                "overwrite", true
        );

        Map uploadResult = cloudinary.uploader().upload(image, params);

        return (String) uploadResult.get("secure_url");
    }
}
