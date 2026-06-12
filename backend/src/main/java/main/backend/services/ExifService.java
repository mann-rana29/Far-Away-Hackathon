package main.backend.services;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.GpsDirectory;
import main.backend.models.GeoLocation;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class ExifService {

    public GeoLocation getGeoLocation(MultipartFile file) throws Exception {
        var inputStream = file.getInputStream();

        Metadata metadata = ImageMetadataReader.readMetadata(inputStream);

        GpsDirectory gpsDirectory = metadata.getFirstDirectoryOfType(GpsDirectory.class);

        if(gpsDirectory == null) throw new Exception("Metadata is missing");

        com.drew.lang.GeoLocation location = gpsDirectory.getGeoLocation();

        if(location == null) throw new Exception("Location is missing");

        if(location.getLongitude() ==  0|| location.getLatitude() == 0){
            throw new Exception("Lat and Long are missing in metadata");
        }

        return new GeoLocation(location.getLatitude(), location.getLongitude());
    }
}
