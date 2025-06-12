package com.team3.airdnd.payment.domain;
import com.team3.airdnd.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MethodType methodType;

    private String lastFourDigits;

    private Boolean isDefault;

    public enum MethodType {
        CARD, TOSSPAY, KAKAOPAY
    }
}
