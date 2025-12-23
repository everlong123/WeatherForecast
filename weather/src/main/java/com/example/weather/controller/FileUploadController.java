package com.example.weather.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/uploads")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads";

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "File rỗng");
                return ResponseEntity.badRequest().body(error);
            }

            // Tạo thư mục nếu chưa tồn tại
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file an toàn
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image";
            String cleanName = originalName.replaceAll("[^a-zA-Z0-9.\\-]", "_");
            String filename = timestamp + "_" + cleanName;

            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target);

            // URL truy cập ảnh (được map ở WebConfig)
            String url = "/uploads/" + filename;
            Map<String, String> body = new HashMap<>();
            body.put("url", url);

            return ResponseEntity.ok(body);
        } catch (IOException e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Không thể lưu file: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}


