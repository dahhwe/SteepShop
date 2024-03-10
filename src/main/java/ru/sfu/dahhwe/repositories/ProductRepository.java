package ru.sfu.dahhwe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.sfu.dahhwe.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
