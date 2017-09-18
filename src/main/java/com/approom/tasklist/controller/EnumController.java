package com.approom.tasklist.controller;

import com.approom.tasklist.entity.TaskState;
import com.controller.AjaxResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(value = "/appTaskList/entity/enum")
public class EnumController {

    @RequestMapping(value = "/{entityId}")
    public Map<String, Object> getEnumValues(@PathVariable("entityId")String enumName){

        Enum[] enumValues = null;
        if (enumName.equals("taskState")){
            enumValues = TaskState.values();
        }

        return AjaxResponse.successResponse(enumValues);
    }
}
