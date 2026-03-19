import React from "react";

function ChecklistItem({ id, title, subtitle1, subtitle2, subtitle3, subtitle4, star, checked, onChange, weekday, newItemDate }) {
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

  // Check if the item should be displayed based on weekday
  const shouldDisplay = () => {

    if (!weekday) return true; // If no weekday specified, always display
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    return weekday === today;
  };

  if (!shouldDisplay()) return null;

  const isWeekdaySpecific = weekday !== undefined && weekday !== null;

  const isNewItem = () => {
    if (!newItemDate) return false;

    const [year, month, day] = newItemDate.split('-').map(Number);
    const itemDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = today - itemDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div className={`checkbox-wrapper ${isWeekdaySpecific ? 'weekday-specific' : ''} ${isNewItem() ? 'new-item-border' : ''}`}>
      {isNewItem() && <span className="new-item-title">Nova tarefa</span>}
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
        {buttonLink && buttonText && (
          <a href={buttonLink} target="_blank" rel="noreferrer" className="item-action-button">
            {buttonText}
          </a>
        )}
      </div>
      {star ? (<span className="star"><img src="/Star.svg" alt="" /></span>) : ""}
    </div>
  );
}

export default ChecklistItem;

