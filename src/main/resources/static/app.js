document.addEventListener("DOMContentLoaded", () => {
    const personenInput = document.getElementById("personen");
    const budgetInput = document.getElementById("budget");
    const productsContainer = document.getElementById("products");
    const gesamtKostenEl = document.getElementById("gesamtKosten");
    const verfuegbarEl = document.getElementById("verfuegbar");
    const abschlussButton = document.getElementById("abschluss");
    const addProductButton = document.getElementById("addProductButton");
    const productModal = document.getElementById("productModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const submitProductButton = document.getElementById("submitProductButton");
    const productNameInput = document.getElementById("productName");
    const productPriceInput = document.getElementById("productPrice");

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
        productsContainer.innerHTML = ''; // Clear previous products
        for (const produkt in produkte) {
            const price = produkte[produkt];
            const sanitizedProdukt = produkt.replace(/\s+/g, '_'); // Replace spaces with underscores
            const container = document.createElement("div");

            container.innerHTML = `
            <label>${produkt} (${price} €): </label>
            <input type="number" id="product-${sanitizedProdukt}" value="0" min="0" />
        `;
            productsContainer.appendChild(container);

            // Initialize bestellung object
            bestellung[produkt] = 0;

            // Attach event listener for quantity input
            const input = container.querySelector(`#product-${sanitizedProdukt}`);
            if (input) {
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

    // Handle order completion with POST request
    abschlussButton.addEventListener("click", () => {
        const orderData = {
            produkte: {}
        };

        // Collect the order data (products and their quantities)
        for (const produkt in bestellung) {
            if (bestellung[produkt] > 0) {
                orderData.produkte[produkt] = bestellung[produkt];
            }
        }

        // Send the order data to the backend
        fetch("/api/abschluss", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData), // Send the collected order data
        })
            .then(response => response.text()) // Receive the final order text
            .then(orderText => {
                // Display the final order text
                alert(orderText);
            })
            .catch(error => {
                console.error("Fehler beim Senden der Bestellung:", error);
            });
    });

    // Add listeners for personen and budget input changes
    personenInput.addEventListener("input", updateKosten);
    budgetInput.addEventListener("input", updateKosten);

    // Show modal for adding a new product
    addProductButton.addEventListener("click", () => {
        productModal.style.display = "block"; // Show modal
    });

    // Close modal
    closeModalButton.addEventListener("click", () => {
        productModal.style.display = "none"; // Hide modal
    });

    // Submit new product to backend
    submitProductButton.addEventListener("click", () => {
        const newProductName = productNameInput.value.trim();
        const newProductPrice = parseFloat(productPriceInput.value);

        if (!newProductName || isNaN(newProductPrice)) {
            alert("Bitte geben Sie einen gültigen Produktnamen und Preis ein.");
            return;
        }

        const newProduct = {
            productName: newProductName,
            price: newProductPrice
        };

        // Send the new product data to the backend
        fetch("/api/produkte", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        })
            .then(response => response.text())
            .then(message => {
                alert(message); // Show success or error message
                productModal.style.display = "none"; // Hide modal after submitting
                // Refresh the product list
                return fetch("/api/produkte");
            })
            .then(response => response.json())
            .then(data => {
                produkte = data;
                renderProducts(); // Re-render product list with the new product
                updateKosten(); // Recalculate costs
            })
            .catch(error => {
                console.error("Fehler beim Hinzufügen des Produkts:", error);
            });
    });
});
