package com.gustavo.autoestudo.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import com.gustavo.autoestudo.enums.StatusEstagiario;

@Entity
@Data
public class Estagiario {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  private String primeiroNome;
  private String segundoNome;
  private String email;
  private StatusEstagiario status;
  //private boolean status; // ativo(1) ou inativo(0)

  @ManyToOne
  @JoinColumn(name = "projeto_id")
  private Projeto projeto;
}