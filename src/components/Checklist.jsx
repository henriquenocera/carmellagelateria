import React, { useState, useEffect } from "react";
import ChecklistItem from "./ChecklistItem";

function Checklist() {
  const [checklistItems, setChecklistItems] = useState([
    {
      id: "item1",
      title: "Item 1",
      subtitle1: "Subtitle 1",
      subtitle2: "Subtitle 2",
      checked: false
    },
    {
      id: "item2",
      title: "Item 2",
      subtitle1: "Subtitle 1",
      subtitle2: "Subtitle 2",
      checked: false
    }
  ]);

  useEffect(() => {
    // Load saved state from localStorage
    const savedState = localStorage.getItem("checklistState");
    if (savedState) {
      setChecklistItems(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem("checklistState", JSON.stringify(checklistItems));
  }, [checklistItems]);

  const handleItemChange = (id) => {
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="checklist">
      {checklistItems.map(item => (
        <ChecklistItem
          key={item.id}
          id={item.id}
          title={item.title}
          subtitle1={item.subtitle1}
          subtitle2={item.subtitle2}
          checked={item.checked}
          onChange={() => handleItemChange(item.id)}
        />
      ))}
    </div>
  );
}

export default Checklist; 