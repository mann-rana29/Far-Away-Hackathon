package main.backend.security;

import main.backend.models.User;
import main.backend.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class CustomUserDetailsService implements UserDetailsService
{
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
         User user = userRepository.findByPhone(phone).orElseThrow(() -> new UsernameNotFoundException("User not found : "+ phone));

          return new CustomUserDetails(user);
    }
}
