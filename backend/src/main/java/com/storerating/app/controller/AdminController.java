package com.storerating.app.controller;

import com.storerating.app.dto.AddStoreRequest;
import com.storerating.app.dto.AddUserRequest;
import com.storerating.app.model.Store;
import com.storerating.app.model.User;
import com.storerating.app.service.AdminService;
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
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private StoreService storeService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @PostMapping("/users")
    public ResponseEntity<?> addUser(@Valid @RequestBody AddUserRequest request) {
        try {
            User user = adminService.addUser(request);
            return ResponseEntity.ok(toUserResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @PostMapping("/stores")
    public ResponseEntity<?> addStore(@Valid @RequestBody AddStoreRequest request) {
        try {
            Store store = adminService.addStore(request);
            return ResponseEntity.ok(toStoreResponse(store));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String role,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir
    ) {
        List<User> users = adminService.getAllUsers();

        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            if (name != null && !u.getName().toLowerCase().contains(name.toLowerCase())) continue;
            if (email != null && !u.getEmail().toLowerCase().contains(email.toLowerCase())) continue;
            if (address != null && !u.getAddress().toLowerCase().contains(address.toLowerCase())) continue;
            if (role != null && !u.getRole().equalsIgnoreCase(role)) continue;
            result.add(toUserResponse(u));
        }

        result.sort((a, b) -> {
            String valA = String.valueOf(a.get(sortBy));
            String valB = String.valueOf(b.get(sortBy));
            int cmp = valA.compareToIgnoreCase(valB);
            return sortDir.equalsIgnoreCase("desc") ? -cmp : cmp;
        });

        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserDetails(@PathVariable Long id) {
        try {
            User user = adminService.getUserDetails(id);
            Map<String, Object> response = toUserResponse(user);
            if (user.getRole().equals("STORE_OWNER")) {
                List<Store> stores = storeService.getStoresByOwner(user.getId());
                if (!stores.isEmpty()) {
                    response.put("rating", storeService.getAverageRating(stores.get(0)));
                } else {
                    response.put("rating", 0.0);
                }
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(e.getMessage()));
        }
    }

    @GetMapping("/stores")
    public ResponseEntity<?> getStores(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir
    ) {
        List<Store> stores = adminService.getAllStores();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Store s : stores) {
            if (name != null && !s.getName().toLowerCase().contains(name.toLowerCase())) continue;
            if (email != null && !s.getEmail().toLowerCase().contains(email.toLowerCase())) continue;
            if (address != null && !s.getAddress().toLowerCase().contains(address.toLowerCase())) continue;
            result.add(toStoreResponse(s));
        }

        result.sort((a, b) -> {
            Object valA = a.get(sortBy);
            Object valB = b.get(sortBy);
            int cmp = String.valueOf(valA).compareToIgnoreCase(String.valueOf(valB));
            return sortDir.equalsIgnoreCase("desc") ? -cmp : cmp;
        });

        return ResponseEntity.ok(result);
    }

    private Map<String, Object> toUserResponse(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("address", user.getAddress());
        map.put("role", user.getRole());
        return map;
    }

    private Map<String, Object> toStoreResponse(Store store) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", store.getId());
        map.put("name", store.getName());
        map.put("email", store.getEmail());
        map.put("address", store.getAddress());
        map.put("rating", adminService.getAverageRating(store));
        return map;
    }

    private Map<String, String> error(String message) {
        Map<String, String> map = new HashMap<>();
        map.put("message", message);
        return map;
    }
}
