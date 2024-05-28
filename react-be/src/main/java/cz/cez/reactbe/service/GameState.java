package cz.cez.reactbe.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GameState {
    private final List<GameField> lead;
    private final List<GameField> secondary;
    private String leadName;
    private String secondaryName;
    private boolean started;

    public boolean isStarted() {
        return started;
    }

    public void setStarted(boolean started) {
        this.started = started;
    }

    public synchronized void addLead(GameField gameField) {
        lead.add(gameField);
    }

    public synchronized void addSecondary(GameField gameField) {
        secondary.add(gameField);
    }

    public GameState(List<GameField> fields) {
        lead = Collections.synchronizedList(fields);
        secondary = Collections.synchronizedList(fields);
    }

    public GameState() {
        lead = Collections.synchronizedList(new ArrayList<>());
        secondary = Collections.synchronizedList(new ArrayList<>());
    }

    public String getLeadName() {
        return leadName;
    }

    public void setLeadName(String leadName) {
        this.leadName = leadName;
    }

    public String getSecondaryName() {
        return secondaryName;
    }

    public void setSecondaryName(String secondaryName) {
        this.secondaryName = secondaryName;
    }
}
