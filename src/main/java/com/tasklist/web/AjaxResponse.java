package com.tasklist.web;

import java.util.HashMap;
import java.util.Map;

public class AjaxResponse {
    public static Map<String, Object> successResponse(Object object) {
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("status", 200);
        response.put("message", "success");
        response.put("data", object);
        return response;
    }

    public static Map<String, Object> emptyResponse() {
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("status", 200);
        response.put("message", "success");
        response.put("data", "");
        return response;
    }

    public static Map<String, Object> errorResponse(String errorMessage) {
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("status", 300);
        response.put("message", errorMessage);
        response.put("data", "");
        return response;
    }
}
