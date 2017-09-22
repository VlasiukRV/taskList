package com.controller;

import com.dao.SearchCriteria;
import com.entity.BaseEntity;
import com.service.BaseEntityService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
        return AjaxResponse.successResponse(entityList);
    }

    public Map<String, Object> findEntity(String search) {
        if (entityService == null) {
            return AjaxResponse.errorResponse("entity '" + entityName + "' not found");
        }

        List<BaseEntity> entityList;
        List<SearchCriteria> params = new ArrayList<SearchCriteria>();
        if (search != null) {
            Pattern pattern = Pattern.compile("(\\w+?)(:|<|>|=|>=|<=)(\\w+?)");
            Matcher matcher = pattern.matcher(search + ",");
            while (matcher.find()) {
                params.add(new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3)));
            }
        }
        if (params.isEmpty()){
            entityList = entityService.getAll();
        }else {
            entityList = entityService.search(params);
        }
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
