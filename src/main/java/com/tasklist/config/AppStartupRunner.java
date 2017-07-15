package com.tasklist.config;

import com.tasklist.app.service.JdbcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Init application before run.
 *
 * @author Roman Vlasiuk
 */
@Component
public class AppStartupRunner implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(AppStartupRunner.class);
    @Autowired
    public JdbcService jdbcService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        logger.info("Your application started with option names : {}", args.getOptionNames());

        System.out.println("		---- Init data base");
        jdbcService.initDataBase();
    }

}
