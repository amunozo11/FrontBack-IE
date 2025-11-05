package com.sinsync.proyectoIE.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class HttpSecurityConfig {
    @Autowired
    private AuthenticationProvider authenticationProvider;
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    private static final String[] WHITE_LIST_URL = {
            "/api/v1/auth/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "/token/**",
            "/simple/**",
            "/compuesto/**",
            "/anualidades/**",
            "/gradientes/**",
            "/amortización/**",
            "/bonos/**",
            "/evaluacion/**",
            "/inflacion/**",
            "/colectiva/**",
            "/individual/**",
            "/mixto/**",
            "/seguros/**",
            "/tircontable/**",
            "/tirmodificada/**",
            "/tirreal/**",
            "/tirsimple/**",
            "/uvr/**",
            "/cuentas/**",
            "/movimientos/**",
            "/pagos/**",
            "/prestamos/**"
    };
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http.csrf(csrfConfig -> csrfConfig.disable())
                .sessionManagement(sessionManConfig -> sessionManConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //Las sesiones ya no van a tener estados
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .securityMatcher("/api/**")
                .authorizeHttpRequests(authConfig -> {
                    authConfig.requestMatchers(WHITE_LIST_URL).permitAll();
                    authConfig.anyRequest().authenticated();
                });

        return http.build();
    }
}
