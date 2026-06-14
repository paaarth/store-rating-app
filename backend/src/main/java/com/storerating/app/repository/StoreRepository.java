package com.storerating.app.repository;

import com.storerating.app.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findByEmail(String email);
    boolean existsByEmail(String email);
}
