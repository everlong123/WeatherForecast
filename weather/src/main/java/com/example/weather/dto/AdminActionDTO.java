package com.example.weather.dto;

import com.example.weather.entity.AdminAction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminActionDTO {
    private Long id;
    private Long adminId;
    private String adminUsername;
    private Long reportId;
    private String reportTitle;
    private AdminAction.ActionType actionType;
    private String comment;
    private LocalDateTime createdAt;

    public static AdminActionDTO fromEntity(AdminAction action) {
        if (action == null) {
            return null;
        }
        AdminActionDTO dto = new AdminActionDTO();
        dto.setId(action.getId());
        if (action.getAdmin() != null) {
            dto.setAdminId(action.getAdmin().getId());
            dto.setAdminUsername(action.getAdmin().getUsername());
        }
        if (action.getReport() != null) {
            dto.setReportId(action.getReport().getId());
            dto.setReportTitle(action.getReport().getTitle());
        }
        dto.setActionType(action.getActionType());
        dto.setComment(action.getComment());
        dto.setCreatedAt(action.getCreatedAt());
        return dto;
    }
}
