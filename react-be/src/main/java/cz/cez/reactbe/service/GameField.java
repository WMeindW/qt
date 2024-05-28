package cz.cez.reactbe.service;

public class GameField {
    public Type type;
    public int row;
    public int column;
    public boolean isActive;
    public boolean isUnderConstruction;
    public boolean isBroken;
    public boolean isRepairing;

    public GameField() {
    }

    public GameField(Type type, int row, int column, boolean isActive, boolean isUnderConstruction, boolean isBroken, boolean isRepairing) {
        this.type = type;
        this.row = row;
        this.column = column;
        this.isActive = isActive;
        this.isUnderConstruction = isUnderConstruction;
        this.isBroken = isBroken;
        this.isRepairing = isRepairing;
    }

    @Override
    public String toString() {
        return "GameField{" + "type=" + type + ", row=" + row + ", column=" + column + ", isActive=" + isActive + ", isUnderConstruction=" + isUnderConstruction + ", isBroken=" + isBroken + ", isRepairing=" + isRepairing + '}';
    }
}
