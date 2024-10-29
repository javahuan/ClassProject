package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
public class FileInfoController {
    @GetMapping("/getUploadedFileName")
    public Map<String, String> getUploadedFileName(HttpSession session) {
        String fileName = (String) session.getAttribute("uploadedFileName");
        Map<String, String> response = new HashMap<>();
        response.put("fileName", fileName);
        return response;
    }
}
