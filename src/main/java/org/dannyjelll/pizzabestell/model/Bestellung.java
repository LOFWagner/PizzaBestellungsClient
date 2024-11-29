package org.dannyjelll.pizzabestell.model;

import java.util.Map;

public class Bestellung {

    private Map<String, Integer> produkte; // Produktname und Anzahl
    private int personen;                 // Anzahl der Personen
    private double budgetProPerson;       // Budget pro Person

    // Standardkonstruktor
    public Bestellung() {
    }

    // Getter und Setter
    public Map<String, Integer> getProdukte() {
        return produkte;
    }

    public void setProdukte(Map<String, Integer> produkte) {
        this.produkte = produkte;
    }

    public int getPersonen() {
        return personen;
    }

    public void setPersonen(int personen) {
        this.personen = personen;
    }

    public double getBudgetProPerson() {
        return budgetProPerson;
    }

    public void setBudgetProPerson(double budgetProPerson) {
        this.budgetProPerson = budgetProPerson;
    }

    // Methode zur Berechnung der Gesamtkosten
    public double getGesamtKosten(Map<String, Double> preise) {
        return produkte.entrySet()
                .stream()
                .mapToDouble(entry -> preise.getOrDefault(entry.getKey(), 0.0) * entry.getValue())
                .sum();
    }
}
