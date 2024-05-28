package cz.cez.reactbe.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GameState {
    private List<GameField> lead;
    private List<GameField> secondary;
    private String leadName;
    private String secondaryName;
    private boolean started;

    public boolean isStarted() {
        return started;
    }

    public void setStarted(boolean started) {
        this.started = started;
    }

    public synchronized void setLead(List<GameField> lead) {
        this.lead = Collections.synchronizedList(lead);
    }

    public List<GameField> getLead() {
        return lead;
    }

    public List<GameField> getSecondary() {
        return secondary;
    }

    public synchronized void setSecondary(List<GameField> secondary) {
        this.secondary = Collections.synchronizedList(secondary);
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
