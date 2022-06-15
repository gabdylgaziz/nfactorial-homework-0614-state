import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = window.localStorage.getItem('items') ? JSON.parse(window.localStorage.getItem('items')) : []

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState(() => toDoItems);

  const [filterType, setFilterType] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
};


  const handleAddItem = () => {
    setItems((prevItems) => [
      { key: uuidv4() ,label: itemToAdd },
      ...prevItems,
    ]);
    const updatedItems = [{ key: uuidv4() , label: itemToAdd}, ...items];
    window.localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };


  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const deleteItems = (item, key) => {
    setItems((prevItems) => prevItems.filter((item) => {
      if(item.key !== key){
        return item;
      }
    }));
    window.localStorage.setItem('items', JSON.stringify([items]));
  };

  const importantGoal = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else return item;
      })
    );
  };

  const searchEngine = () => {
    console.log(document.getElementById('search').value)
  }

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const amountImportant = items.filter((item) => item.important).length;

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done, {amountImportant} important
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input type="text" className="form-control search-input" placeholder="type to search" onLoad={searchEngine()} id = "search"></input>
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item${item.important ? " important" : ""}${item.done ? " done" : ""}`}>
                <span className="todo-list-item-label" onClick={() => handleItemDone(item)}>
                  {item.label}
                </span>

                <button type="button" className="btn btn-outline-success btn-sm float-right" onClick={() => importantGoal(item)}>
                  <i className="fa fa-exclamation" />
                  
                </button>

                <button type="button" className="btn btn-outline-danger btn-sm float-right" onClick={() => deleteItems(item, item.key)}>
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
