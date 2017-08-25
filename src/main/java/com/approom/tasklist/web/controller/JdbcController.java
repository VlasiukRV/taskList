package com.approom.tasklist.web.controller;

import com.approom.tasklist.app.service.JdbcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appTaskList/system/jdbc")
public class JdbcController {
    @Autowired
    JdbcService jdbcService;

/*
    @RequestMapping("/initDataBase")
    public Map<String, Object> initDataBase(){

        Boolean res = jdbcService.initDataBase();

        if (!res){
            return AjaxResponse.successResponse("errror");
        }else {
            return AjaxResponse.successResponse("data inserted Successfully");
        }
    }
*/
}
