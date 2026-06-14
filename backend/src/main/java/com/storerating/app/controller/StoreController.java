package com.storerating.app.controller;

import com.storerating.app.dto.RatingRequest;
import com.storerating.app.model.Rating;
import com.storerating.app.model.Store;
import com.storerating.app.service.StoreService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @GetMapping
    public ResponseEntity<?> getStores(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "5") int size
    ) {
        List<Store> stores = storeService.getAllStores();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Store s : stores) {
            if (search != null && !search.isBlank()) {
                String term = search.toLowerCase();
                boolean nameMatches = s.getName().toLowerCase().contains(term);
                boolean addressMatches = s.getAddress().toLowerCase().contains(term);
                if (!nameMatches && !addressMatches) continue;
            } else {
                if (name != null && !s.getName().toLowerCase().contains(name.toLowerCase())) continue;
                if (address != null && !s.getAddress().toLowerCase().contains(address.toLowerCase())) continue;
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getName());
            map.put("address", s.getAddress());
            map.put("overallRating", storeService.getAverageRating(s));

            if (userId != null) {
                Rating userRating = storeService.getUserRatingForStore(userId, s.getId());
                map.put("userRating", userRating != null ? userRating.getValue() : null);
            } else {
                map.put("userRating", null);
            }

            result.add(map);
        }

        result.sort((a, b) -> {
            Object valA = a.get(sortBy);
            Object valB = b.get(sortBy);
            int cmp = String.valueOf(valA).compareToIgnoreCase(String.valueOf(valB));
            return sortDir.equalsIgnoreCase("desc") ? -cmp : cmp;
        });

        int totalElements = result.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);
        List<Map<String, Object>> pageContent = result.subList(fromIndex, toIndex);

        Map<String, Object> response = new HashMap<>();
        response.put("content", pageContent);
        response.put("currentPage", page);
        response.put("totalPages", totalPages);
        response.put("totalElements", totalElements);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/rate")
    public ResponseEntity<?> rateStore(@RequestParam Long userId, @Valid @RequestBody RatingRequest request) {
        try {
            Rating rating = storeService.submitRating(userId, request);
            Map<String, Object> map = new HashMap<>();
            map.put("storeId", rating.getStore().getId());
            map.put("value", rating.getValue());
            return ResponseEntity.ok(map);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
