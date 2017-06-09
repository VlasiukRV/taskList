package com.tasklist.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/service")
public class ServiceController {

    @Autowired
    IAuthenticationFacade authenticationFacade;

    @RequestMapping("/principal")
    @ResponseBody
    public Principal user(Principal user) {
        return user;
    }

    @RequestMapping("/getCurrentAuthentication")
    @ResponseBody
    public Map<String, Object> currentAuthentication(HttpServletRequest request, Principal user) {
        Map<String, String> currentAuthentication = new HashMap<>();
        currentAuthentication.put("userName", authenticationFacade.getAuthentication().getName());
        return AjaxResponse.successResponse(currentAuthentication);
    }

}
