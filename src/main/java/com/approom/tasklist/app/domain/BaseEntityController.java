package com.approom.tasklist.app.domain;

import com.approom.tasklist.web.AjaxResponse;

import java.util.List;
import java.util.Map;

public abstract class BaseEntityController {
    protected String entityName;
    protected BaseEntityService entityService;

   public Map<String, Object> getEntityById(Integer id) {
        if (entityService == null) {
            return AjaxResponse.errorResponse("entity '" + entityName + "' not found");
        }

        BaseEntity entity = entityService.getEntityById(id);
        if (entity == null){
            return AjaxResponse.errorResponse(entityName + " not found by id " + id);
        }
        return AjaxResponse.successResponse(entity);
    }

    public Map<String, Object> getEntity() {
        if (entityService == null) {
            return AjaxResponse.errorResponse("entity '" + entityName + "' not found");
        }

        List<BaseEntity> entityList = entityService.getAll();
/*
        if (entityList.size() == 0){
            return AjaxResponse.errorResponse( "List of '" +entityName+ "' is empty ");
        }
*/
        return AjaxResponse.successResponse(entityList);
    }

    public Map<String, Object> deleteEntity(Integer id) {
        if (entityService == null) {
            return AjaxResponse.errorResponse("entity '" + entityName + "' not found");
        }

        try {
            if (!entityService.deleteEntity(id)) {
                return AjaxResponse.errorResponse("entity '" + entityName + " id " + id + "' not deleted");
            }
        }catch (RuntimeException ex){
            return AjaxResponse.errorResponse("entity '" + entityName + " id " + id + "' not deleted");
        }

        return AjaxResponse.successResponse(true);
    }

    public Map<String, Object> createEntityStrJSON(String strJSONEntity) {
        if (entityService == null) {
            return AjaxResponse.errorResponse("entity '" + entityName + "' not found");
        }

        BaseEntity entity = null;
        try {
            entity = entityService.saveEntity(strJSONEntity);
        }catch (Exception e){
            e.printStackTrace();
        }

        if (entity == null || (Integer)entity.getId() == 0){
            return AjaxResponse.errorResponse("entity '" + entityName + "' not created");
        }
        return AjaxResponse.successResponse(entity);
    }

}
