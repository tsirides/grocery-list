import { useContext } from "react";
import { GroceryContext } from "../App";

export default function GroceryForm() {
  const value = useContext(GroceryContext);

  function increment(func) {
    if (func === "add") {
      value.setQuantity((prev) => prev + 1);
    } else if (func === "remove" && value.quantity >= 1) {
      value.setQuantity((prev) => prev - 1);
    }
  }

  return (
    <div>
      <div className="header">
        <div className="heading">
          <h1>Grocery List App</h1>
          <h2>Create your Grocery List</h2>
        </div>
        <button onClick={value.clearList}>Clear List</button>
      </div>
      <form action={value.handleSubmit}>
        <div className="numbers">
          <button
            className="increment"
            type="button"
            onClick={() => increment("remove")}
          >
            -
          </button>
          <input
            onChange={(e) => value.setQuantity(Number(e.target.value))}
            value={Number(value.quantity)}
            placeholder="1"
            name="number"
            type="number"
          />
          <button
            className="increment"
            type="button"
            onClick={() => increment("add")}
          >
            +
          </button>
        </div>
        <div className="item-input">
          <input placeholder="ex. Tomatoes" name="item" type="text" />
          <button type="submit">Add item</button>
        </div>
      </form>
    </div>
  );
}
