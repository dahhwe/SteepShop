package ru.sfu.dahhwe.services;

import org.springframework.stereotype.Service;
import ru.sfu.dahhwe.entities.Product;
import ru.sfu.dahhwe.repositories.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(Product newProduct) {
        return productRepository.save(newProduct);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product productToUpdate = optionalProduct.get();
            productToUpdate.setName(productDetails.getName());
            productToUpdate.setDescription(productDetails.getDescription());
            productToUpdate.setPrice(productDetails.getPrice());
            productToUpdate.setImageUrl(productDetails.getImageUrl());
            productToUpdate.setCategory(productDetails.getCategory());
            productToUpdate.setQuantity(productDetails.getQuantity());
            return productRepository.save(productToUpdate);
        }
        return null;
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}