
package com.tasklist.config;

import com.tasklist.web.CsrfHeaderFilter;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

@Configuration
@EnableWebSecurity
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("user").password("password").roles("USER").build());
        manager.createUser(User.withUsername("admin").password("password").roles("USER","ADMIN").build());
        return manager;
    }

/*
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
/*
        auth.jdbcAuthentication()
                .dataSource(dataSource)
                .usersByUsernameQuery("select str_login as principal, str_password as credentials, true from t_user where str_login = ?")
                .authoritiesByUsernameQuery("select str_login as principal, ln_type as role from t_user where str_login = ?")
                .rolePrefix("ROLE_");
*//*



    }
*/

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests() /*.httpBasic().and()*/
                .antMatchers(
                        "/",
                        "/css/**",
                        "/js/**",
                        "/templates/**",
                        "/login",
                        "/service/**"

                ).permitAll()
                .antMatchers("/usersList/**").access("hasRole('ADMIN')")
                    .antMatchers("/system/task/**").access("hasRole('ADMIN')")
                .anyRequest().authenticated()
                .and()

                .formLogin().loginPage("/login")
                .and()

                .logout()
                .logoutUrl("/logout")
                    .logoutSuccessUrl("/")
                    .invalidateHttpSession(true)
/*
                    .logoutSuccessHandler(logoutSuccessHandler)

                    .addLogoutHandler(logoutHandler)
                    .deleteCookies(cookieNamesToClear)
*/
                    .and()
                .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
                    .csrf()
                    .csrfTokenRepository(csrfTokenRepository())/*.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());*/
                    .and()
                .httpBasic();
    }

    private CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-XSRF-TOKEN");
        return repository;
    }
}
