package com.approom.tasklist.web.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Service for manage users when they logout from application
 * implements {@link org.springframework.context.ApplicationListener}
 *
 * @author Roman Vlasiuk
 */
@Component
public class LogoutListenerImpl implements ApplicationListener<SessionDestroyedEvent> {

    @Autowired
    private SecurityService securityService;

    @Override
    public void onApplicationEvent(SessionDestroyedEvent event) {
        List<SecurityContext> lstSecurityContext = event.getSecurityContexts();
        UserDetails userDetails;
        for (SecurityContext securityContext : lstSecurityContext) {
            userDetails = (UserDetails) securityContext.getAuthentication()
                    .getPrincipal();
            if (userDetails instanceof UserDetails) {
                // Обработка завершения сессии (запись в лог или что там)
                // UserDetailsImpl - ваша реализация UserDetails
                // ...ToDo
            }
        }
    }
}
