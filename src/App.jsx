import { createContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import GroceryForm from "./components/GroceryForm";
import "./App.css";
import clsx from "clsx";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  databaseURL: import.meta.env.VITE_DATABASE,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDB = ref(database, "items");

const GroceryContext = createContext();

export default function App() {
  const [groceryList, setGroceryList] = useState([]);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    onValue(referenceInDB, function (snapshot) {
      const snapshotDoesExist = snapshot.exists();
      if (snapshotDoesExist) {
        const snapshotValues = snapshot.val();
        setGroceryList(Object.values(snapshotValues));
      }
    });
  }, []);

  const contextValues = {
    handleSubmit,
    clearList,
    quantity,
    setQuantity,
  };

  function handleSubmit(formData) {
    const newItem = {
      uuid: uuid(),
      number: formData.get("number"),
      item: formData.get("item"),
      isChecked: false,
    };
    if (formData.get("number") > 0 && formData.get("item").length > 0) {
      push(referenceInDB, newItem);
      setQuantity(0);
    }
  }

  function deleteItem(id) {
    setGroceryList(groceryList.filter((item) => item.uuid !== id));
    onValue(
      referenceInDB,
      (snapshot) => {
        const data = snapshot.val();
        const itemKey = Object.keys(data).find((key) => data[key].uuid === id);
        if (itemKey) {
          remove(ref(database, `items/${itemKey}`));
        }
      },
      { onlyOnce: true }
    );
  }

  function clearList() {
    if (groceryList.length > 0) {
      if (confirm("Are you sure you want to clear the list?")) {
        setGroceryList([]);
        remove(referenceInDB);
      } else {
        return;
      }
    }
  }

  function checkItem(id) {
    onValue(
      referenceInDB,
      (snapshot) => {
        const data = snapshot.val();
        const itemKey = Object.keys(data).find((key) => data[key].uuid === id);

        if (itemKey) {
          const itemRef = ref(database, `items/${itemKey}`);
          const currentChecked = data[itemKey].isChecked;
          set(itemRef, {
            ...data[itemKey],
            isChecked: !currentChecked,
          });
        }
      },
      { onlyOnce: true }
    );
  }

  return (
    <GroceryContext.Provider value={contextValues}>
      <GroceryForm />
      <div className="item-list">
        <ul>
          {groceryList?.map((item) => {
            return (
              <li key={item.uuid}>
                <div
                  className={clsx(`item-head ${item.isChecked && "strike"}`)}
                >
                  <button onClick={() => deleteItem(item.uuid)}>&times;</button>
                  <span>
                    {item.number} {item.item}
                  </span>
                </div>
                <input
                  onChange={() => checkItem(item.uuid)}
                  checked={item.isChecked}
                  type="checkbox"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </GroceryContext.Provider>
  );
}

export { GroceryContext };
