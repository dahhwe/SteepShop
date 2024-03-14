package ru.sfu.dahhwe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.sfu.dahhwe.entities.Product;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find products by category ID
    List<Product> findByCategoryId(Long categoryId);

    // Find products with price greater than or equal to
    List<Product> findByPriceGreaterThanEqual(BigDecimal price);

    // Find products with name containing a string (case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products by name (exact match)
    List<Product> findByName(String name);


}
