package cz.cez.reactbe.controller;

import cz.cez.reactbe.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class GameRestController {

    @Autowired
    GameService service;

    @CrossOrigin(origins = "*")
    @PostMapping(value = "/create", produces = "text/plain")
    public String createGame(@RequestBody String body) {
        return service.generate(service.parseFields(body));
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/join", produces = "text/plain")
    public String joinGame(@RequestParam String name, @RequestParam boolean isLead, @RequestParam String id) {
        return service.joinGame(isLead, name, id).toString();
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/started", produces = "text/plain")
    public String started(@RequestParam String id) {
        return service.started(id).toString();
    }

    @CrossOrigin(origins = "*")
    @PostMapping(value = "/save", produces = "text/plain")
    public String save(@RequestBody String id) {
        return "Ha";
    }


}
