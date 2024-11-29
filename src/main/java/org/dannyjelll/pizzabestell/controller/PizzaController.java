package org.dannyjelll.pizzabestell.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.dannyjelll.pizzabestell.comp.ProductConfig;
import org.dannyjelll.pizzabestell.model.Bestellung;
import org.dannyjelll.pizzabestell.model.NewProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
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

    @PutMapping("/produkte")
    public ResponseEntity<String> addProdukt(@RequestBody NewProduct newProduct) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // Load the existing config.json
            InputStream is = getClass().getClassLoader().getResourceAsStream("config.json");
            ProductConfig config = mapper.readValue(is, ProductConfig.class);

            // Add the new product to the product list
            Map<String, Double> produkte = config.getProdukte();
            produkte.put(newProduct.getProductName(), newProduct.getPrice());

            // Save the updated product list to config.json
            File configFile = new File("src/main/resources/config.json");
            mapper.writeValue(configFile, config);
            productConfig.reloadConfig();
            return ResponseEntity.ok("Produkt erfolgreich hinzugefügt.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Fehler beim Hinzufügen des Produkts.");
        }
    }

    @PostMapping("/abschluss")
    public ResponseEntity<String> abschluss(@RequestBody Bestellung bestellung) {
        // Format the order data into a message string
        StringBuilder message = new StringBuilder("Wir würden bitte bestellen:\n");
        for (Map.Entry<String, Integer> entry : bestellung.getProdukte().entrySet()) {
            message.append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
        }
        message.append("Lieferung bitte an Erzbergerstraße 121, 76133 Karlsruhe\n");
            return ResponseEntity.status(HttpStatus.OK).body(message.toString());

    }
}
