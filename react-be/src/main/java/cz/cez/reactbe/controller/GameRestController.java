package cz.cez.reactbe.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.cez.reactbe.service.GameField;
import cz.cez.reactbe.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
public class GameRestController {

    @Autowired
    GameService service;

    @CrossOrigin(origins = "*")
    @PostMapping(value = "/create", produces = "text/plain")
    public String createGame(@RequestBody String body) {
        return service.generate(service.parseFields(body.split("fields\":")[1]));
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/join", produces = "text/plain")
    public String joinGame(@RequestParam String name, @RequestParam boolean isLead, @RequestParam String id) {
        return service.joinGame(isLead, name, id).toString();
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/started", produces = "text/plain")
    public String started(@RequestParam String id) {
        return service.started(id);
    }

    @CrossOrigin(origins = "*")
    @PostMapping(value = "/save", produces = "text/plain")
    public String save(@RequestBody String body) throws JsonProcessingException {
        String score = body.split("score\":")[1].split(",")[0].replace("\"", "");
        boolean isLead = Boolean.parseBoolean(body.split("isLead\":")[1].split(",")[0]);
        String id = body.split("id\":")[1].split(",")[0].replace("\"", "");
        String split = body.split("fields\":")[1];
        ObjectMapper mapper = new ObjectMapper();
        List<GameField> fields = service.save(service.parseFields(split.substring(0, split.length() - 1)), id, isLead, score);
        return mapper.writeValueAsString(fields);
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/score", produces = "text/plain")
    public String getScore(@RequestParam String id, @RequestParam boolean isLead) {
        return service.score(id, isLead);
    }
}
