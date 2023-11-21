package com.srmv.student_management_system.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)throws Exception{
        http.authorizeRequests()
//                should declare every module of the system & which users have access to them.
                .antMatchers("/Resources/**").permitAll()
                .antMatchers("/style.css").permitAll()
                .antMatchers("/createadmin").permitAll()
                .antMatchers("/login").permitAll()
                .antMatchers("/dashboard").hasAnyAuthority("Administrator","Principal","Teacher","Employee")
                .antMatchers("/student").hasAnyAuthority("Administrator","Principal","Employee")
                .antMatchers("/guardian").hasAnyAuthority("Administrator","Principal","Employee")
                .antMatchers("/user").hasAnyAuthority("Administrator")
                .antMatchers("/academic_year").hasAnyAuthority("Administrator","Principal")
                .antMatchers("/attendance").hasAnyAuthority("Administrator","Principal","Teacher")
                .antMatchers("/privilege").hasAnyAuthority("Administrator")
                .antMatchers("/employee").hasAnyAuthority("Administrator","Principal")
                .antMatchers("/teacher").hasAnyAuthority("Administrator","Principal")
                .antMatchers("/exam").hasAnyAuthority("Administrator","Principal")
                .antMatchers("/exam_results").hasAnyAuthority("Administrator","Principal","Teacher")
                .antMatchers("/classroom").hasAnyAuthority("Administrator","Principal","Teacher")
                .antMatchers("/student_registration").hasAnyAuthority("Administrator","Principal","Employee")
                .antMatchers("/privilege").hasAnyAuthority("Administrator")




//              Give the authentication to users mentioned with respect the module
                .anyRequest().authenticated().and()

//              Deny the permission to access this system by other sites
                .csrf().disable()

//              which UI should be displayed as the login form
                .formLogin().loginPage("/login")

//               what UI should be displayed when the login is failed
                .failureForwardUrl("/login")

//                what to show when login is successful
                .defaultSuccessUrl("/dashboard")

//                Validating username & password
                .usernameParameter("username")
                .passwordParameter("password")

                .and()
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/log_out"))
                .logoutSuccessUrl("/login")

//                Handling exceptions
                .and()
                .exceptionHandling()

                .accessDeniedPage("/access_denied");

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
