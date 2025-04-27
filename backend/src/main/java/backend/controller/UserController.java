package backend.controller;

import backend.exception.UserNotFoundException;
import backend.model.UserModel;
import backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin("http://localhost:3000")
public class UserController {

    private final UserRepository repository;
    private final String UPLOAD_DIR = "src/main/uploads/";

    @Autowired
    public UserController(UserRepository repository) {
        this.repository = repository;

        // Ensure upload directory exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    // Register User
    @PostMapping("/register")
    public UserModel registerUser(@RequestBody UserModel user) {
        return repository.save(user);
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserModel user) {
        Optional<UserModel> foundUser = repository.findByUsername(user.getUsername());
        if (foundUser.isPresent() && foundUser.get().getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(foundUser.get());
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    // Get all users
    @GetMapping
    public List<UserModel> getAllUsers() {
        return repository.findAll();
    }

    // Get User by ID
    @GetMapping("/{id}")
    public UserModel getUser(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    // Update User with optional image
    @PutMapping("/{id}")
    public UserModel updateUser(
            @RequestPart(value = "userDetails") String userDetails,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable Long id) {

        ObjectMapper mapper = new ObjectMapper();
        UserModel updatedUser;
        try {
            updatedUser = mapper.readValue(userDetails, UserModel.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing userDetails", e);
        }

        return repository.findById(id).map(existingUser -> {
            // Update basic fields
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setGender(updatedUser.getGender());
            existingUser.setPassword(updatedUser.getPassword());
            existingUser.setMobile(updatedUser.getMobile());
            existingUser.setDateOfBirth(updatedUser.getDateOfBirth());
            existingUser.setDescription(updatedUser.getDescription());

            // Handle image upload if present
            if (file != null && !file.isEmpty()) {
                handleImageUpload(file, existingUser);
            }

            return repository.save(existingUser);
        }).orElseThrow(() -> new UserNotFoundException(id));
    }

    // Upload Profile Picture
    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        return repository.findById(id)
                .map(user -> {
                    try {
                        handleImageUpload(file, user);
                        repository.save(user);
                        return ResponseEntity.ok(user);
                    } catch (RuntimeException e) {
                        return ResponseEntity.status(500)
                                .body("Error uploading image: " + e.getMessage());
                    }
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    // Serve uploaded images
    @GetMapping("/uploads/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    // Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return repository.findById(id)
                .map(user -> {
                    // Delete associated image if exists
                    if (user.getImage() != null) {
                        File imageFile = new File(UPLOAD_DIR + user.getImage());
                        if (imageFile.exists()) {
                            imageFile.delete();
                        }
                    }

                    repository.deleteById(id);
                    return ResponseEntity.ok("User with ID " + id + " deleted successfully.");
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    // Follow User
    @PutMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long id) {
        return repository.findById(id)
                .map(user -> {
                    user.setFollowers(user.getFollowers() + 1);
                    repository.save(user);
                    return ResponseEntity.ok(user);
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    // Unfollow User
    @PutMapping("/{id}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable Long id) {
        return repository.findById(id)
                .map(user -> {
                    if (user.getFollowers() > 0) {
                        user.setFollowers(user.getFollowers() - 1);
                    }
                    repository.save(user);
                    return ResponseEntity.ok(user);
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    // Helper method for image upload handling
    private void handleImageUpload(MultipartFile file, UserModel user) {
        try {
            // Generate unique filename
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // Delete old image if exists
            if (user.getImage() != null) {
                File oldImage = new File(UPLOAD_DIR + user.getImage());
                if (oldImage.exists()) {
                    oldImage.delete();
                }
            }

            // Save the new file
            file.transferTo(Paths.get(UPLOAD_DIR + fileName));

            // Update user with new image filename
            user.setImage(fileName);
        } catch (IOException e) {
            throw new RuntimeException("Error saving uploaded file", e);
        }
    }
}