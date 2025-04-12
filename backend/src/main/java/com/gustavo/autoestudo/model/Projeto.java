package com.gustavo.autoestudo.model;
import java.util.List;
import com.gustavo.autoestudo.enums.StatusProjeto;
import com.gustavo.autoestudo.enums.TurnoProjeto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Projeto {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;
  
  private String nome;
  private TurnoProjeto turno;
  private StatusProjeto status;

  @OneToMany(mappedBy = "projeto")
  private List<Estagiario> estagiarios;
  
}