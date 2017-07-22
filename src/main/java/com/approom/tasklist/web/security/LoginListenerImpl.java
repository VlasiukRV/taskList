package com.approom.tasklist.web.security;

import com.approom.tasklist.app.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/**
 * Service for manage users when they login to application
 * implements {@link org.springframework.context.ApplicationListener}
 *
 * @author Roman Vlasiuk
 */
@Component
public class LoginListenerImpl implements ApplicationListener<AuthenticationSuccessEvent> {

    @Autowired
    private SecurityService securityService;

    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent appEvent) {
        AuthenticationSuccessEvent event = appEvent;
        UserDetails userDetails = (UserDetails) event.getAuthentication().getPrincipal();
        if (userDetails instanceof UserDetails) {
            // Обрабатываем успешный вход в систему (запись в лог или что там).
            // UserDetailsImpl - это ваша реализация интерфейса UserDetails
            // ...ToDo
        }
    }
}
