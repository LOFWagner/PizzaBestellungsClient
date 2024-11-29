package org.dannyjelll.pizzabestell.controller;

import org.dannyjelll.pizzabestell.comp.ProductConfig;
import org.dannyjelll.pizzabestell.model.Bestellung;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PizzaController {

    @Autowired
    private ProductConfig productConfig;

    @GetMapping("/produkte")
    public ResponseEntity<Map<String, Double>> getProdukte() {
        return ResponseEntity.ok(productConfig.getProdukte());
    }

    @PostMapping("/berechnung")
    public ResponseEntity<Map<String, Object>> berechneKosten(@RequestBody Bestellung bestellung) {
        double total = 0.0;
        for (Map.Entry<String, Integer> entry : bestellung.getProdukte().entrySet()) {
            double preis = productConfig.getProdukte().get(entry.getKey());
            total += preis * entry.getValue();
        }
        double budget = bestellung.getPersonen() * bestellung.getBudgetProPerson();
        Map<String, Object> result = new HashMap<>();
        result.put("gesamtKosten", total);
        result.put("verfügbar", budget - total);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/abschluss")
    public ResponseEntity<String> generiereBestellung(@RequestBody Bestellung bestellung) {
        StringBuilder text = new StringBuilder("Ihre Bestellung:\n");
        bestellung.getProdukte().forEach((produkt, menge) -> {
            text.append(String.format("- %s: %d\n", produkt, menge));
        });
        text.append(String.format("\nGesamtkosten: %.2f EUR", bestellung.getGesamtKosten(productConfig.getProdukte())));
        return ResponseEntity.ok(text.toString());
    }

}
