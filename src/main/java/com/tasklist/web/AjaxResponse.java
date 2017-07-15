package com.tasklist.web;

import java.util.HashMap;
import java.util.Map;

/**
 * Response wrapper
 *
 * @author Roman Vlasiuk
 */
public class AjaxResponse {

    public static Map<String, Object> buildResponse(int status, String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("message", message);
        response.put("data", data);
        return response;
    }

    public static Map<String, Object> successResponse(String message, Object object) {
        return buildResponse(200, message, object);
    }

    public static Map<String, Object> successResponse(Object object) {
        return buildResponse(200, "success", object);
    }

    public static Map<String, Object> emptyResponse() {
        return buildResponse(200, "success", "");
    }

    public static Map<String, Object> errorResponse(String errorMessage) {
        return buildResponse(300, errorMessage, "");
    }
}
