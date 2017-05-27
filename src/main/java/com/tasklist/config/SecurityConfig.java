
package com.tasklist.config;

import com.tasklist.web.CsrfHeaderFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

@Configuration
@EnableWebSecurity
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .inMemoryAuthentication()
                .withUser("admin1").password("1").roles("ADMIN").and()
                .withUser("user1").password("1").roles("USER");

/*
        auth.jdbcAuthentication()
                .dataSource(dataSource)
                .usersByUsernameQuery("select str_login as principal, str_password as credentials, true from t_user where str_login = ?")
                .authoritiesByUsernameQuery("select str_login as principal, ln_type as role from t_user where str_login = ?")
                .rolePrefix("ROLE_");
*/


    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic().and()
                .authorizeRequests() /*.httpBasic().and()*/
                    .antMatchers(
                                    "/js/**", "/css/**", "/index.html", "/index",
                                    "/login.html", "/", "/login", "/login-error",
                                    "/error", "/errorPage"
                                ).permitAll()
                    .antMatchers("/usersList").access("hasRole('ADMIN')")
                    .anyRequest().authenticated()/*.access("hasRole('USER') or hasRole('ADMIN')")*/ /*.authenticated()*/
                .and().formLogin().loginPage("/login").failureUrl("/login-error")
/*
                .and()
                .formLogin()
                .loginPage("/login")
                .permitAll()*/
/*.permitAll()*/

                .and()
                .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
                .csrf()
                    /*.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());*/
                    .csrfTokenRepository(csrfTokenRepository());


        /*
                .antMatchers("/index.html", "/public", "/login").permitAll() */
/*").denyAll()  *//*

                .antMatchers("/taskList").access("hasRole('USER') or hasRole('ADMIN')") //"/resources*//*
*/
/* ",
                .antMatchers("/taskList/usersList").access(" hasRole('ADMIN')")
*/
/*               .and().formLogin().loginPage("/login").permitAll() *//*.loginPage("/login")*/
                /*.and().logout()*/
/*                .and().exceptionHandling().accessDeniedPage("/403")*/

    }

    private CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-XSRF-TOKEN");
        return repository;
    }
}
