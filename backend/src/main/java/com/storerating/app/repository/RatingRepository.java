package com.storerating.app.repository;

import com.storerating.app.model.Rating;
import com.storerating.app.model.Store;
import com.storerating.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByStore(Store store);
    List<Rating> findByUser(User user);
    Optional<Rating> findByUserAndStore(User user, Store store);
}
