package com.example.weather.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        Map<String, String> response = new HashMap<>();
        if (!errors.isEmpty()) {
            response.put("message", "Dữ liệu không hợp lệ: " + errors.values().iterator().next());
        } else {
            response.put("message", "Dữ liệu không hợp lệ");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> response = new HashMap<>();
        String message = ex.getMessage();
        
        if (message != null) {
            if (message.contains("Username already exists")) {
                response.put("message", "Tên đăng nhập đã tồn tại");
            } else if (message.contains("Email already exists")) {
                response.put("message", "Email đã được sử dụng");
            } else if (message.contains("User not found")) {
                response.put("message", "Người dùng không tồn tại");
            } else if (message.contains("đã tồn tại")) {
                response.put("message", message);
            } else if (message.contains("not found")) {
                response.put("message", message.replace("not found", "không tồn tại"));
            } else {
                response.put("message", message);
            }
        } else {
            response.put("message", "Đã xảy ra lỗi");
        }
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Map<String, String> response = new HashMap<>();
        String message = ex.getMessage();
        
        if (message != null) {
            if (message.contains("Duplicate entry") && message.contains("incident_types")) {
                // Extract the duplicate value from error message
                String duplicateValue = extractDuplicateValue(message);
                response.put("message", "Loại sự cố '" + duplicateValue + "' đã tồn tại. Vui lòng chọn tên khác.");
            } else if (message.contains("Duplicate entry") && message.contains("users")) {
                if (message.contains("username")) {
                    response.put("message", "Tên đăng nhập đã tồn tại");
                } else if (message.contains("email")) {
                    response.put("message", "Email đã được sử dụng");
                } else {
                    response.put("message", "Dữ liệu trùng lặp");
                }
            } else {
                response.put("message", "Dữ liệu không hợp lệ hoặc đã tồn tại");
            }
        } else {
            response.put("message", "Dữ liệu không hợp lệ");
        }
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    private String extractDuplicateValue(String message) {
        // Try to extract the duplicate value from error message
        // Example: "Duplicate entry 'Gió' for key 'UKp186ha71urs7fo0vt1r2rbcrm'"
        try {
            int start = message.indexOf("'") + 1;
            int end = message.indexOf("'", start);
            if (start > 0 && end > start) {
                return message.substring(start, end);
            }
        } catch (Exception e) {
            // Ignore extraction error
        }
        return "này";
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        String errorMessage = ex.getMessage();
        
        // Don't expose internal error details, just show user-friendly message
        if (errorMessage != null && (errorMessage.contains("Duplicate entry") || errorMessage.contains("constraint"))) {
            response.put("message", "Dữ liệu trùng lặp hoặc không hợp lệ");
        } else {
            response.put("message", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
        
        ex.printStackTrace(); // Log for debugging
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}










