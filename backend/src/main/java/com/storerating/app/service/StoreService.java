package com.storerating.app.service;

import com.storerating.app.dto.RatingRequest;
import com.storerating.app.model.Rating;
import com.storerating.app.model.Store;

import java.util.List;

public interface StoreService {

    List<Store> getAllStores();

    double getAverageRating(Store store);

    Rating getUserRatingForStore(Long userId, Long storeId);

    Rating submitRating(Long userId, RatingRequest request);

    Store getStoreById(Long id);

    List<Rating> getRatingsForStore(Store store);

    List<Store> getStoresByOwner(Long ownerId);
}
