document.addEventListener("DOMContentLoaded", () => {
    const personenInput = document.getElementById("personen");
    const budgetInput = document.getElementById("budget");
    const productsContainer = document.getElementById("products");
    const gesamtKostenEl = document.getElementById("gesamtKosten");
    const verfuegbarEl = document.getElementById("verfuegbar");
    const abschlussButton = document.getElementById("abschluss");

    let produkte = {}; // Products fetched from the backend
    let bestellung = {}; // Tracks product quantities

    // Fetch products from the backend
    fetch("/api/produkte")
        .then(response => response.json())
        .then(data => {
            produkte = data;
            renderProducts();
            updateKosten(); // Initial calculation
        });

    // Render product inputs dynamically
    function renderProducts() {
        for (const produkt in produkte) {
            const price = produkte[produkt];
            const container = document.createElement("div");

            container.innerHTML = `
                <label>${produkt} (${price} €): </label>
                <input type="number" id="product-${produkt}" value="0" min="0" />
            `;
            productsContainer.appendChild(container);

            // Initialize bestellung object
            bestellung[produkt] = 0;

            // Delay event listener attachment to ensure element exists in DOM
            const input = container.querySelector(`#product-${produkt}`);
            if (input) { // Check if input exists before attaching event listener
                input.addEventListener("input", () => {
                    bestellung[produkt] = parseInt(input.value) || 0;
                    updateKosten();
                });
            }
        }
    }

    // Update total cost and remaining budget
    function updateKosten() {
        const personen = parseInt(personenInput.value) || 1;
        const budget = parseFloat(budgetInput.value) || 0;
        const totalBudget = personen * budget;

        let gesamtKosten = 0;
        for (const produkt in bestellung) {
            gesamtKosten += bestellung[produkt] * produkte[produkt];
        }

        const verfuegbar = totalBudget - gesamtKosten;

        // Update the DOM with calculated costs
        gesamtKostenEl.textContent = gesamtKosten.toFixed(2);
        verfuegbarEl.textContent = verfuegbar.toFixed(2);
    }

    // Handle order completion
    abschlussButton.addEventListener("click", () => {
        const summary = Object.keys(bestellung)
            .filter(produkt => bestellung[produkt] > 0)
            .map(produkt => `${bestellung[produkt]}x ${produkt}`)
            .join(", ");

        alert(`Ihre Bestellung: ${summary}\nGesamtkosten: ${gesamtKostenEl.textContent} €`);
    });

    // Add listeners for personen and budget input changes
    personenInput.addEventListener("input", updateKosten);
    budgetInput.addEventListener("input", updateKosten);
});
