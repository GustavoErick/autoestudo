package com.gustavo.autoestudo.repository;

import java.util.List;

import com.gustavo.autoestudo.model.Estagiario;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

    
// @RepositoryRestResource(collectionResourceRel = "people", path = "people")
@RepositoryRestResource
@CrossOrigin("http://localhost:3000")
public interface EstagiarioRepository extends PagingAndSortingRepository<Estagiario, Long>, CrudRepository<Estagiario, Long> {

    List<Estagiario> findBysegundoNome(@Param("name") String name);

}