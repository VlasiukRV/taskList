
package com.approom.tasklist.config;

import com.approom.tasklist.app.service.JdbcService;
import com.approom.tasklist.web.security.CsrfHeaderFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.session.HttpSessionEventPublisher;

import javax.sql.DataSource;

/**
 * Configure security configuration for application
 * extends {@link org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter}
 *
 * @author Roman Vlasiuk
 */
@Configuration
@EnableWebSecurity()
/*@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)*/
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ConfigSecurity extends WebSecurityConfigurerAdapter {

    @Autowired
    public JdbcService jdbcService;

/*
    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("user").password("password").roles("USER").build());
        manager.createUser(User.withUsername("admin").password("password").roles("USER","ADMIN").build());
        return manager;
    }
*/

    @Autowired
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        DataSource dataSource = jdbcService.getDataSource();

        auth.jdbcAuthentication()
                .dataSource(dataSource)
                .usersByUsernameQuery("select username, password, 'true' as enabled FROM user where username=?")
                .authoritiesByUsernameQuery("select u.username, r.role from user as u inner join user_roles as ur on(u.id=ur.user_id) inner join role as r on(ur.role_id=r.id) where username=?")
        ;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                    .antMatchers(
                            "/",
                            "/css/**",
                            "/img/**",
                            "/fonts/**",
                            "/js/**",
                            "/templates/**",
                            "/service/**",
                            "/info/**",

                            "/taskList",
                            "/appTaskList"
                    ).permitAll()
                    .antMatchers("/appTaskList/security/**", "/appTaskList/system/task/**").hasRole("ADMIN")
                    .antMatchers("/appTaskList/**").hasRole("USER")
                    .anyRequest().authenticated()
                    .and()
                .formLogin()
                    .loginPage("/login")
                    .usernameParameter("username").passwordParameter("password")
                    .permitAll()
                    .and()
                .logout()
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/login")
                    .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler())
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID", "X-XSRF-TOKEN")
                    .permitAll()
                    .and()
                .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
                    .csrf()
                    .csrfTokenRepository(csrfTokenRepository())
                    .and()
                .httpBasic()
                    .and()
                .sessionManagement()
                    .maximumSessions(1)
                    .maxSessionsPreventsLogin(true)
                    .sessionRegistry(sessionRegistry());
    }

    private CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-XSRF-TOKEN");
        return repository;
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public ServletListenerRegistrationBean<HttpSessionEventPublisher> httpSessionEventPublisher() {
        return new ServletListenerRegistrationBean<>(new HttpSessionEventPublisher());
    }
}
