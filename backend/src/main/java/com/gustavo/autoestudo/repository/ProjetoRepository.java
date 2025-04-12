package com.gustavo.autoestudo.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.gustavo.autoestudo.model.Projeto;

@RepositoryRestResource(collectionResourceRel = "projetos", path = "projetos")
public interface ProjetoRepository extends CrudRepository<Projeto, Long> {
    
    
}