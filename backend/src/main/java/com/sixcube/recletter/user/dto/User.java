package com.sixcube.recletter.user.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
public class User implements UserDetails {

//  @Id @GeneratedValue(strategy = GenerationType.UUID)
//  private UUID uuid;

  //  @Column(nullable = false, unique = true)
  @NotBlank
  @Id
  private String userId;

  @Email
  @NotBlank
  @Column(nullable = false)
  private String userEmail;

  @NotBlank
  @Column(nullable = false)
  private String userNickname;

  @NotBlank
  @Column(nullable = false)
  private String userPassword;

  @CreationTimestamp(source = SourceType.DB)
  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime deletedAt;


  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Collection<GrantedAuthority> authorities = new ArrayList<>();
    // 해당 사용자 객체가 가지게 될 역할을 부여.
    // 역할은 여려개를 가질 수 있고, 각 역할에 각각의 권한(Authority)를 부여할 수 있다.
//    switch (userType) {
//      case 0:
//        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
//        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
//        break;
//      case 1:
//        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
//        break;
//      default:
//    }

    return authorities;
  }

  public User(RegistReq registReq) {
    this.userId = registReq.getUserId();
    this.userEmail = registReq.getUserEmail();
    this.userPassword = registReq.getUserPassword();
    this.userNickname = registReq.getUserName();
  }
  @Override
  public String getPassword() {
    return userPassword;
  }

  // Spring Security에서 userName은 id를 의미함
  @Override
  public String getUsername() {
    return userId;
  }

  @Override
  public boolean isAccountNonExpired() {
    return deletedAt == null;
  }

  @Override
  public boolean isAccountNonLocked() {
    return deletedAt == null;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
