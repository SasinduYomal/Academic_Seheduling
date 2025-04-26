package backend.controller;

import backend.exception.UserNotFoundException;
import backend.model.UserModel;
import backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserRepository repository;
    private final String PROFILE_IMAGE_DIR = "src/main/uploads/";
    private final String POST_IMAGE_DIR = "src/main/uploads/posts/";

    @Autowired
    public UserController(UserRepository repository) {
        this.repository = repository;

        // Ensure upload directory exists
        File postUploadDir = new File(POST_IMAGE_DIR);
        if (!postUploadDir.exists()) {
            postUploadDir.mkdirs();
        }

        File profileUploadDir = new File(PROFILE_IMAGE_DIR);
        if (!profileUploadDir.exists()) {
            profileUploadDir.mkdirs();
        }
    }

    // Register User
    @PostMapping("/register")
    public UserModel registerUser(@RequestBody UserModel user) {
        return repository.save(user);
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserModel user, HttpServletRequest request) {
        Optional<UserModel> foundUser = repository.findByUsername(user.getUsername());
        if (foundUser.isPresent() && foundUser.get().getPassword().equals(user.getPassword())) {
            // Create a session and store user information
            HttpSession session = request.getSession(true);
            session.setAttribute("user", foundUser.get());
            return ResponseEntity.ok(foundUser.get());
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false); // get session if exists
        if (session != null) {
            session.invalidate(); // destroy session
        }

        // Clear cookies if needed
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out successfully.");
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

    // Get User by Username
    @GetMapping("/user/me")
    public Map<String, Object> getUserInfo(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("user", principal.getAttributes());
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
        File profileImage = new File(PROFILE_IMAGE_DIR + filename);
        File postImage = new File(POST_IMAGE_DIR + filename);

        if (profileImage.exists()) {
            return ResponseEntity.ok(new FileSystemResource(profileImage));
        } else if (postImage.exists()) {
            return ResponseEntity.ok(new FileSystemResource(postImage));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

   // Delete User
@DeleteMapping("/{id}")
public ResponseEntity<String> deleteUser(
        @PathVariable Long id,
        HttpServletRequest request,
        HttpServletResponse response) {

    User user = repository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));

    deleteUserImage(user);
    repository.deleteById(id);
    invalidateSessionAndClearCookie(request, response);

    return ResponseEntity.ok("User with ID " + id + " deleted successfully.");
}

private void deleteUserImage(User user) {
    if (user.getImage() != null) {
        File imageFile = new File(PROFILE_IMAGE_DIR + user.getImage());
        if (imageFile.exists()) {
            imageFile.delete();
        }
    }
}

private void invalidateSessionAndClearCookie(HttpServletRequest request, HttpServletResponse response) {
    HttpSession session = request.getSession(false);
    if (session != null) {
        session.invalidate();
    }

    Cookie cookie = new Cookie("JSESSIONID", null);
    cookie.setPath("/");
    cookie.setHttpOnly(true);
    cookie.setMaxAge(0);
    response.addCookie(cookie);
}
    // Follow User
@PutMapping("/{id}/follow")
public ResponseEntity<User> followUser(@PathVariable Long id) {
    User user = repository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    
    user.setFollowers(user.getFollowers() + 1);
    User updatedUser = repository.save(user);
    
    return ResponseEntity.ok(updatedUser);
}

// Unfollow User
@PutMapping("/{id}/unfollow")
public ResponseEntity<User> unfollowUser(@PathVariable Long id) {
    User user = repository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    
    user.setFollowers(Math.max(0, user.getFollowers() - 1));
    User updatedUser = repository.save(user);
    
    return ResponseEntity.ok(updatedUser);
}

    // Helper method for image upload handling
    private void handleImageUpload(MultipartFile file, UserModel user) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // Delete old profile image if exists
            if (user.getImage() != null) {
                File oldImage = new File(PROFILE_IMAGE_DIR + user.getImage());
                if (oldImage.exists()) {
                    oldImage.delete();
                }
            }

            // Save new profile image
            File profileDir = new File(PROFILE_IMAGE_DIR);
            if (!profileDir.exists()) profileDir.mkdirs();

            file.transferTo(Paths.get(PROFILE_IMAGE_DIR + fileName));
            user.setImage(fileName);
        } catch (IOException e) {
            throw new RuntimeException("Error saving uploaded profile image", e);
        }
    }
}