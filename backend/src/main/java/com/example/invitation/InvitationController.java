package com.example.invitation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/invitations")
@CrossOrigin(origins = "http://localhost:5173")
public class InvitationController {
    private final JavaMailSender mailSender;
    private final String recipient;

    public InvitationController(JavaMailSender mailSender, @Value("${invitation.recipient}") String recipient) {
        this.mailSender = mailSender;
        this.recipient = recipient;
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@Valid @RequestBody InvitationRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipient);
        message.setSubject("Mỹ Nguyên đã chọn một quán cafe ☕");
        message.setText("""
                Có một lời mời cafe vừa được confirm 💙

                Tên: %s
                Khu vực: %s
                Địa điểm: %s
                Địa chỉ: %s
                Google Maps: %s
                Ngày: %s
                Giờ: %s
                Cách chọn: %s

                Received at: %s
                """.formatted(request.name(), request.area(), request.cafeName(),
                request.address().isBlank() ? "N/A" : request.address(),
                request.mapsUrl().isBlank() ? "N/A" : request.mapsUrl(),
                request.date(), request.time(), request.source(), LocalDateTime.now()));
        mailSender.send(message);
        return ResponseEntity.ok(Map.of("success", true));
    }

    public record InvitationRequest(
            @NotBlank String name,
            @NotBlank String area,
            @NotBlank String cafeName,
            String address,
            String mapsUrl,
            @NotBlank String date,
            @NotBlank String time,
            @NotBlank String source
    ) {
        public InvitationRequest {
            address = address == null ? "" : address;
            mapsUrl = mapsUrl == null ? "" : mapsUrl;
        }
    }
}
