# Pizza Order Client

This project is a service for a pizza ordering application. It allows users to select pizzas, specify quantities, and calculate the total cost. The backend also supports adding new products and finalizing the order, generating a text message that can be sent to a pizza maker.

## Technologies Used

- Java
- Spring Boot
- Maven
- Gson (for JSON processing)
- HTML, CSS, JavaScript (for frontend)

## Project Structure

- `src/main/java/org/dannyjelll/pizzabestell/comp/ProductConfig.java`: Loads and manages the product configuration from a JSON file.
- `src/main/java/org/dannyjelll/pizzabestell/controller/PizzaController.java`: REST controller that handles API requests for products, cost calculation, adding new products, and finalizing orders.
- `src/main/resources/config.json`: JSON file containing the list of available products and their prices.
- `src/main/resources/static/index.html`: Frontend HTML file for the pizza ordering interface.
- `src/main/resources/static/style.css`: CSS file for styling the frontend.
- `src/main/resources/static/app.js`: JavaScript file for handling frontend interactions and communicating with the backend.
- `src/main/resources/config.json` : Stores the available order options
## API Endpoints

### Get Products

- **URL**: `/api/produkte`
- **Method**: `GET`
- **Response**: JSON object containing the list of products and their prices.

### Calculate Costs

- **URL**: `/api/berechnung`
- **Method**: `POST`
- **Request Body**: JSON object containing the order details (`produkte`, `personen`, `budgetProPerson`).
- **Response**: JSON object containing the total cost and remaining budget.

### Add New Product

- **URL**: `/api/produkte`
- **Method**: `PUT`
- **Request Body**: JSON object containing the new product details (`productName`, `price`).
- **Response**: Success or error message.

### Finalize Order

- **URL**: `/api/abschluss`
- **Method**: `POST`
- **Request Body**: JSON object containing the order details (`produkte`).
- **Response**: Text message summarizing the order.

## Running the Project

1. **Clone the repository**:
    ```sh
    git clone https://github.com/LOFWagner/PizzaBestellungsClient
    cd <repository-directory>
    ```

2. **Build the project**:
    ```sh
    mvn clean install
    ```

3. **Run the application**:
    ```sh
    mvn spring-boot:run
    ```

4. **Access the frontend**:
    Open a web browser and navigate to `http://localhost:8080`.

## Example Usage

1. **Fetch available products**:
    ```sh
    curl -X GET http://localhost:8080/api/produkte
    ```

2. **Calculate costs**:
    ```sh
    curl -X POST http://localhost:8080/api/berechnung -H "Content-Type: application/json" -d '{"produkte":{"Margherita":2,"Salami":1},"personen":3,"budgetProPerson":10}'
    ```

3. **Add a new product**:
    ```sh
    curl -X PUT http://localhost:8080/api/produkte -H "Content-Type: application/json" -d '{"productName":"Pepperoni","price":8.5}'
    ```

4. **Finalize the order**:
    ```sh
    curl -X POST http://localhost:8080/api/abschluss -H "Content-Type: application/json" -d '{"produkte":{"Margherita":2,"Salami":1}}'
    ```

## License

This project is licensed under the MIT License.
