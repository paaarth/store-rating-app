package com.storerating.app.service;

import com.storerating.app.dto.AddStoreRequest;
import com.storerating.app.dto.AddUserRequest;
import com.storerating.app.model.Store;
import com.storerating.app.model.User;

import java.util.List;
import java.util.Map;

public interface AdminService {

    Map<String, Object> getDashboardStats();

    User addUser(AddUserRequest request);

    Store addStore(AddStoreRequest request);

    List<User> getAllUsers();

    List<Store> getAllStores();

    double getAverageRating(Store store);

    User getUserDetails(Long id);
}
