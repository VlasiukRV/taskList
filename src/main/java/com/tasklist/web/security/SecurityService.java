package com.tasklist.web.security;

import com.tasklist.web.AjaxResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for manage users
 *
 * @author Roman Vlasiuk
 */
@Service
public class SecurityService implements HttpSessionListener {
    private static int totalActiveSessions;
    @Autowired
    private SessionRegistry sessionRegistry;

    public static int getTotalActiveSession() {
        return totalActiveSessions;
    }

    @Override
    public void sessionCreated(HttpSessionEvent httpSessionEvent) {
        totalActiveSessions++;
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent httpSessionEvent) {
        totalActiveSessions--;
    }

    public Map<String, Object> getSessionInformation(HttpServletRequest request) {
        SessionInformation sessionInformation = sessionRegistry.getSessionInformation(request.getSession().getId());
        User user = (User) sessionInformation.getPrincipal();

        Map<String, Object> currentPrincipal = new HashMap<>();
        currentPrincipal.put("sessionId", sessionInformation.getSessionId());
        currentPrincipal.put("userName", user.getUsername());
        currentPrincipal.put("authorities", user.getAuthorities());
        return currentPrincipal;
    }

    public Map<String, Object> getAllPrincipals() {
        List<Object> principals = sessionRegistry.getAllPrincipals();

        return AjaxResponse.successResponse(principals);
    }

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }


}
