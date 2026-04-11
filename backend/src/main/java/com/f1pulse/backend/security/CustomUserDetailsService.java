package com.f1pulse.backend.security;

import com.f1pulse.backend.model.User;
import com.f1pulse.backend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Initialize authorities list (empty for now, can add roles later)
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        
        // Future: Load user roles from database
        // authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        // if (user.getRole() != null) {
        //     authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        // }

        // Return Spring Security User object
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
