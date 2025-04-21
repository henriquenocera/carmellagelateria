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
        className="inp-cbx"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className="cbx">
        <span>
          <svg width="12px" height="10px" viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
          </svg>
        </span>
        <span>{title}</span>
      </label>
      <div className="checkbox-subtitle">
        <p>{subtitle1}</p>
        <p>{subtitle2}</p>
      </div>
      {star ? (<span className="star"><img src="/Star.svg" alt="" /></span>) : ""}
    </div>
  );
}

export default ChecklistItem;

