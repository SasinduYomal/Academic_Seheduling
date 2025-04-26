package backend.service;

import backend.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Delegate to Spring's default loading mechanism
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oauth2User = delegate.loadUser(userRequest);

        // Extract Google attributes
        String googleSub = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        // Find or create user
        UserModel user = userService.findByGoogleSub(googleSub);
        if (user == null) {
            user = userService.createUserFromOAuth2(googleSub, email, name, picture);
        }

        // Prepare mapped attributes for the frontend
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("id", user.getId());
        attributes.put("username", user.getUsername());
        attributes.put("email", user.getEmail());
        attributes.put("image", user.getImage());
        attributes.put("gender", user.getGender());
        attributes.put("mobile", user.getMobile());
        attributes.put("dateOfBirth", user.getDateOfBirth());
        attributes.put("description", user.getDescription());
        attributes.put("followers", user.getFollowers());

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "email" // used as key for name/identifier
        );
    }
}


