package com.gustavo.autoestudo.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.gustavo.autoestudo.model.Projeto;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(collectionResourceRel = "projetos", path = "projetos")
@CrossOrigin("http://localhost:3000")
public interface ProjetoRepository extends CrudRepository<Projeto, Long> {
    
    
}