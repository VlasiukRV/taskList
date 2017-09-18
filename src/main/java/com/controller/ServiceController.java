package com.controller;

import com.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("/appTaskList/service")
public class ServiceController {

    @Autowired
    SecurityService securityService;

    @RequestMapping("/authenticate")
    @ResponseBody
    public Map<String, Object> user(HttpServletRequest request) {
        return AjaxResponse.successResponse(securityService.getSessionInformation(request));
    }

}
