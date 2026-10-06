package com.lifelink.entity;

public enum RequestPriority {
    CRITICAL(1.00),
    HIGH(0.80),
    MEDIUM(0.50),
    LOW(0.25);

    private final double weight;

    RequestPriority(double weight) {
        this.weight = weight;
    }

    public double getWeight() {
        return weight;
    }
}
