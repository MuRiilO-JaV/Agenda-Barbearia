package com.AgendaServico.demo.Repository;

import com.AgendaServico.demo.model.Barbeiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BarbeiroRepository extends JpaRepository<Barbeiro, Integer> {

    // extends JpaRepository<...> --> Importa os métodos prontos do CRUD
    // <Barbeiro, Integer> --> entidade que sera gerenciada e tipo de chave primaria

}
