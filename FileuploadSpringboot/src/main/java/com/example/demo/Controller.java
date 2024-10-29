package com.example.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;


@RestController
public class Controller {


    private static final String UPLOAD_DIR = "src/main/resources/uploads";

    @RequestMapping("/upload")
    public void uploadFile(@RequestParam("file") MultipartFile file, HttpServletResponse response, HttpSession session) throws IOException {
        System.out.println("filename="+file.getOriginalFilename());
        String fileName=file.getOriginalFilename();
        System.out.println("here");
        if (file.isEmpty()) {
            System.out.println("文件为空！");
            response.sendRedirect("/failure.html");
        } else {
            try {
                byte[] bytes = file.getBytes();
                Path uploadPath = Paths.get(UPLOAD_DIR);
                Path path=uploadPath.resolve(file.getOriginalFilename());//拼接路径
                Files.write(path, bytes);
                session.setAttribute("uploadedFileName", fileName);
                response.sendRedirect("/success.html?fileName=" + fileName);
            } catch (IOException e) {
                e.printStackTrace();
                response.sendRedirect("/failure.html");
            }

        }
    }

}