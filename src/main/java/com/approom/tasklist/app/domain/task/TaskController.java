package com.approom.tasklist.app.domain.task;

import com.approom.tasklist.app.domain.BaseEntityController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "/entity/task")
public class TaskController extends BaseEntityController {

    @Autowired
    public TaskController(TaskService entityService) {
        entityName = "task";
        this.entityService = entityService;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    public Map<String, Object> getEntityById(@PathVariable Integer id) {
        return super.getEntityById(id);
    }

    @RequestMapping(value = "", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    public Map<String, Object> getEntity() {
        return super.getEntity();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json; charset=utf-8")
    public Map<String, Object> deleteEntity(@PathVariable("id")Integer id) {
        return super.deleteEntity(id);
    }

    @RequestMapping(value = "", method = RequestMethod.POST, consumes = "application/json; charset=utf-8", produces = "application/json; charset=utf-8")
    public Map<String, Object> createEntityStrJSON(@RequestBody String strJSONEntity) {
        return super.createEntityStrJSON(strJSONEntity);
    }
}
