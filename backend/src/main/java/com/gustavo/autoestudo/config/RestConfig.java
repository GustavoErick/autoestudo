// package com.gustavo.autoestudo.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
// import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;

// @Configuration
// public class RestConfig implements RepositoryRestConfigurer {

//     @Override
//     public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
//         cors.addMapping("/**")
//             .allowedOrigins("http://localhost:3000")
//             .allowedMethods("GET", "POST", "PUT", "DELETE")
//             .allowCredentials(false)
//             .maxAge(3600);
//     }
// }