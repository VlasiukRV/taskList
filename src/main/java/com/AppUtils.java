package com;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.entity.BaseEntity;
import org.hibernate.Hibernate;
import org.hibernate.proxy.HibernateProxy;
import org.yaml.snakeyaml.Yaml;

import java.io.*;

/**
 * Static functions-utility for application.
 *
 * @author Roman Vlasiuk
 */
public class AppUtils {

    public static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public static <T extends BaseEntity> T getEntityByJSON(Class<T> className, String strJSONEntity) {
        try {
            return OBJECT_MAPPER.readValue(strJSONEntity, className);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
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

