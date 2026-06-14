package com.storerating.app.service.impl;

import com.storerating.app.dto.RatingRequest;
import com.storerating.app.model.Rating;
import com.storerating.app.model.Store;
import com.storerating.app.model.User;
import com.storerating.app.repository.RatingRepository;
import com.storerating.app.repository.StoreRepository;
import com.storerating.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.storerating.app.service.StoreService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    @Override
    public double getAverageRating(Store store) {
        List<Rating> ratings = ratingRepository.findByStore(store);
        if (ratings.isEmpty()) {
            return 0.0;
        }
        double sum = 0;
        for (Rating r : ratings) {
            sum += r.getValue();
        }
        return sum / ratings.size();
    }

    @Override
    public Rating getUserRatingForStore(Long userId, Long storeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        return ratingRepository.findByUserAndStore(user, store).orElse(null);
    }

    @Override
    public Rating submitRating(Long userId, RatingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        Rating rating = ratingRepository.findByUserAndStore(user, store)
                .orElse(new Rating());

        rating.setUser(user);
        rating.setStore(store);
        rating.setValue(request.getValue());

        return ratingRepository.save(rating);
    }

    @Override
    public Store getStoreById(Long id) {
        return storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));
    }

    @Override
    public List<Rating> getRatingsForStore(Store store) {
        return ratingRepository.findByStore(store);
    }

    @Override
    public List<Store> getStoresByOwner(Long ownerId) {
        return storeRepository.findAll().stream()
                .filter(s -> s.getOwner() != null && s.getOwner().getId().equals(ownerId))
                .toList();
    }
}
