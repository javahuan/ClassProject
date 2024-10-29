package com.example.demo;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class FileDownloadController {

    private static final String UPLOAD_DIR = "src/main/resources/uploads/";

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(HttpSession session) throws IOException {
        String fileName = (String) session.getAttribute("uploadedFileName");
        if (fileName == null) {
            return ResponseEntity.notFound().build();
        }
        Path path = Paths.get(UPLOAD_DIR + fileName);
        File file = path.toFile();
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }
}
