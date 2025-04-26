package backend.service;

import backend.model.UserModel;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository repository;

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserModel findByGoogleSub(String googleSub) {
        return repository.findByGoogleSub(googleSub).orElse(null);
    }

    public UserModel createUserFromOAuth2(String googleSub, String email, String name, String picture) {
        UserModel newUser = new UserModel();
        newUser.setEmail(email);
        newUser.setUsername(name);
        newUser.setGoogleSub(googleSub);
        return repository.save(newUser);
    }
}

