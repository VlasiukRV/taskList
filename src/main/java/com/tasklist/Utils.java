package com.tasklist;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.Hibernate;
import org.hibernate.proxy.HibernateProxy;
import org.yaml.snakeyaml.Yaml;

import java.io.*;

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
            entity = (T)mapper.readValue(strJSONEntity, className);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

        return entity;
    }

    public static Object getObjectFromYaml(String filename) throws FileNotFoundException {
        if (new File(filename).exists()) {
            InputStream input = new FileInputStream(new File(filename));
            Yaml yaml = new Yaml();
            Object o = yaml.load(input);
            try {
                input.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return o;
        }
        throw new FileNotFoundException();
    }

    public static boolean saveObjectToYaml(Object data, String filename) {
        try {
            if (new File(filename).exists()) {
                Yaml yaml = new Yaml();
                FileWriter writer = new FileWriter(new File(filename));
                yaml.dump(data, writer);
                writer.flush();
                writer.close();
            }
        } catch (IOException e) {
            System.out.println(e.getMessage());
            //e.printStackTrace();
            return false;
        }
        return true;
    }

    public static <T> T initializeAndUnproxy(T entity) {
        if (entity == null) {
            throw new
                    NullPointerException("Entity passed for initialization is null");
        }

        Hibernate.initialize(entity);
        if (entity instanceof HibernateProxy) {
            entity = (T) ((HibernateProxy) entity).getHibernateLazyInitializer()
                    .getImplementation();
        }
        return entity;
    }
}

