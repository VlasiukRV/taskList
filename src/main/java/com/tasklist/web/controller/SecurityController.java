package com.tasklist.web.controller;


import com.tasklist.web.AjaxResponse;
import com.tasklist.web.security.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.Map;

@Controller
@RequestMapping("/system/security")
public class SecurityController {

    @Autowired
    SecurityService securityService;

    @RequestMapping("/getSessionInformation")
    @ResponseBody
    public Map<String, Object> getSessionInformation(HttpServletRequest request) {
        return AjaxResponse.successResponse(securityService.getSessionInformation(request));
    }

    @RequestMapping("/getAllPrincipals")
    @ResponseBody
    public Map<String, Object> getAllPrincipals(HttpServletRequest request, Principal user) {
        return AjaxResponse.successResponse(securityService.getAllPrincipals());
    }

}
