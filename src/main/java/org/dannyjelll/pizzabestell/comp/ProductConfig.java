package org.dannyjelll.pizzabestell.comp;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Component
public class ProductConfig {
    private Map<String, Double> produkte;

    @PostConstruct
    public void loadConfig() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = getClass().getClassLoader().getResourceAsStream("config.json");
        ProductConfig config = mapper.readValue(is, ProductConfig.class);
        this.produkte = config.getProdukte();
    }

    public Map<String, Double> getProdukte() {
        return produkte;
    }
}
