package com.approom.tasklist.app.domain;

import com.approom.tasklist.app.domain.task.TaskState;
import com.approom.tasklist.web.AjaxResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(value = "/entity/enum")
public class EnumController {

    @RequestMapping(value = "/{entityId}")
    public Map<String, Object> getEnumValues(@PathVariable("entityId")String enumName){

        Enum[] enumValues = null;
        if (enumName.equals("TaskState")){
            enumValues = TaskState.values();
        }

        return AjaxResponse.successResponse(enumValues);
    }
}
