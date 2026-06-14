package com.storerating.app.controller;

import com.storerating.app.model.Rating;
import com.storerating.app.model.Store;
import com.storerating.app.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    @Autowired
    private StoreService storeService;

    @GetMapping("/dashboard/{ownerId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long ownerId) {
        List<Store> stores = storeService.getStoresByOwner(ownerId);

        if (stores.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("storeName", null);
            response.put("averageRating", 0.0);
            response.put("ratings", new ArrayList<>());
            return ResponseEntity.ok(response);
        }

        Store store = stores.get(0);
        List<Rating> ratings = storeService.getRatingsForStore(store);

        List<Map<String, Object>> ratingList = new ArrayList<>();
        for (Rating r : ratings) {
            Map<String, Object> map = new HashMap<>();
            map.put("userName", r.getUser().getName());
            map.put("userEmail", r.getUser().getEmail());
            map.put("value", r.getValue());
            ratingList.add(map);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("storeName", store.getName());
        response.put("averageRating", storeService.getAverageRating(store));
        response.put("ratings", ratingList);

        return ResponseEntity.ok(response);
    }
}
