package backend.controller;

import backend.model.Topic;
import backend.service.TopicService; // Ensure this import is correct and the TopicService class exists in the specified package
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin
public class TopicController {

    private final TopicService service;

    public TopicController(TopicService service) {
        this.service = service;
    }

    @GetMapping
    public List<Topic> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Topic one(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Topic create(@Valid @RequestBody Topic topic) {
        return service.save(topic);
    }

    @PutMapping("/{id}")
public ResponseEntity<Topic> updateTopic(@PathVariable Long id, @Valid @RequestBody Topic topic) {
    Topic updatedTopic = service.update(id, topic);
    return ResponseEntity.ok(updatedTopic);
}


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

