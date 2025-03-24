import React from "react";

function ChecklistItem({ id, title, subtitle1, subtitle2, subtitle3, subtitle4, star }) {
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

    < div className="checkbox-wrapper" >
      <input
        required
        className="inp-cbx"
        id={id}
        type="checkbox"
        name={id}
        defaultChecked={isCheck}
      />
      <label className="cbx" htmlFor={id}>
        <span>
          <svg width="12px" height="9px" viewBox="0 0 12 9">
            <polyline points="1 5 4 8 11 1"></polyline>
          </svg>
        </span>
        <span className="label ">{title}</span>
        {star ? (<span className="star"><img src="/Star.svg" alt="" /></span>) : ""}

      </label>
      <span className="subtitle">{subtitle1}</span>
      <span className="subtitle">{subtitle2}</span>
      {subtitle3 ? (<span className="subtitle">{subtitle3}</span>) : ""
      }
      {subtitle4 ? (<span className="subtitle">{subtitle4}</span>) : ""}
    </div >

  )

}

export default ChecklistItem;

