package cz.cez.reactbe.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {
    private final Map<String, GameState> states = new ConcurrentHashMap<>();

    public synchronized String generate(List<GameField> fields) {
        Random random = new Random();
        int number = 10000000 + random.nextInt(90000000); // Generate a number in the range 10000000 to 99999999
        states.put(String.valueOf(number), new GameState(fields));
        return String.valueOf(number);
    }

    public synchronized List<GameField> parseFields(String input) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        try {
            return mapper.readValue(input, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public synchronized Boolean joinGame(boolean isLead, String name, String id) {
        GameState state = states.get(id);
        if (state == null) return false;
        if (isLead) {
            state.setLeadName(name);
        } else {
            state.setSecondaryName(name);
        }

        if (state.getLeadName() != null && state.getSecondaryName() != null) state.setStarted(true);
        return true;
    }

    public synchronized String started(String id) {
        return states.get(id).isStarted() + "," + states.get(id).getSecondaryName() + "," + states.get(id).getLeadName();
    }

    public synchronized String score(String id, boolean isLead) {

        GameState state = states.get(id);
        if (state.getSecondaryScore() != null && state.getLeadScore() != null) {
            if (state.getLeadScore().equals("0") && state.getSecondaryScore().equals("0")) {
                state.setLeadScore("lost");
                state.setSecondaryScore("lost");
            } else if (state.getLeadScore().equals("0")) {
                state.setLeadScore("won");
                state.setSecondaryScore("lost");
            } else if (state.getSecondaryScore().equals("0")) {
                state.setSecondaryScore("won");
                state.setLeadScore("lost");
            }
        }
        return isLead ? state.getSecondaryScore() : state.getLeadScore();
    }

    public synchronized List<GameField> save(List<GameField> fields, String id, boolean isLead, String score) {
        if (isLead) {
            if (fields.isEmpty()) return states.get(id).getSecondary();
            states.get(id).setLead(fields);
            states.get(id).setLeadScore(score);
            return states.get(id).getSecondary();
        } else {
            if (fields.isEmpty()) return states.get(id).getLead();
            states.get(id).setSecondary(fields);
            states.get(id).setSecondaryScore(score);
            return states.get(id).getLead();
        }
    }

}

