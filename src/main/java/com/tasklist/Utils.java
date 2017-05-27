package com.tasklist;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class Utils {

    public static <T> T getEntityByJSON(Class<T> className, String strJSONEntity){

        ObjectMapper mapper = new ObjectMapper();
        T entity = null;

        try {
            entity = className.newInstance();
        } catch (InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
            return null;
        }

        try {
            entity = mapper.readValue(strJSONEntity, className);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

        return entity;
    }

}
