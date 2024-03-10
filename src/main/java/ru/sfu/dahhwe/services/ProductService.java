package ru.sfu.dahhwe.services;

import org.springframework.stereotype.Service;
import ru.sfu.dahhwe.entities.Product;
import ru.sfu.dahhwe.repositories.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }
}
