package com.storerating.app.service.impl;

import com.storerating.app.dto.AddStoreRequest;
import com.storerating.app.dto.AddUserRequest;
import com.storerating.app.model.Rating;
import com.storerating.app.model.Store;
import com.storerating.app.model.User;
import com.storerating.app.repository.RatingRepository;
import com.storerating.app.repository.StoreRepository;
import com.storerating.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.storerating.app.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalStores", storeRepository.count());
        stats.put("totalRatings", ratingRepository.count());
        return stats;
    }

    @Override
    public User addUser(AddUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole());
        return userRepository.save(user);
    }

    @Override
    public Store addStore(AddStoreRequest request) {
        if (storeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Store email already registered");
        }
        Store store = new Store();
        store.setName(request.getName());
        store.setEmail(request.getEmail());
        store.setAddress(request.getAddress());
        if (request.getOwnerId() != null) {
            User owner = userRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("Owner not found"));
            store.setOwner(owner);
        }
        return storeRepository.save(store);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

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
    public User getUserDetails(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
