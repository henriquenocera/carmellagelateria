import React from "react";

function ChecklistItem({ id, title, subtitle1, subtitle2, subtitle3, subtitle4, star, checked, onChange }) {
  function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key)
      return null
    }
    return item.value
  }
  const isCheck = getWithExpiry("check")


  return (
    <div className="checkbox-wrapper">
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>
        <div className="checkbox-title">
          <p>{title}</p>
        </div>
        <div className="checkbox-subtitle">
          <p>{subtitle1}</p>
          <p>{subtitle2}</p>
        </div>
      </label>
      {star ? (<span className="star"><img src="/Star.svg" alt="" /></span>) : ""}
    </div>
  );
}

export default ChecklistItem;

