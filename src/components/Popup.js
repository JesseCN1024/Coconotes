import { keyboard } from '@testing-library/user-event/dist/keyboard';
import React, {useEffect} from 'react'

function Popup(props) {
  function handleConfirmDelete(){
    props.popup.confirmDelete();
    props.setPopup((prev) => ({ ...prev, trigger: false }));
  }
  function closePopup(){
    props.setPopup((prev) => ({
      ...prev,
      trigger: false,
    }));
  }
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode===13) {
        // Confirm Btn function
        if (props.popup.hasBtns){
          handleConfirmDelete();
        }
      }
      // Close Popup
      if (event.keyCode===27) closePopup();
    }
    // Add event listener for the document
    document.addEventListener('keydown', handleKeyDown);
    // After the popup disappear or destroyed, remove eventlistener
    return function(){
      document.removeEventListener('keydown', handleKeyDown);
    }
  },[props.popup.trigger]) // true => render -> run useEffect, false -> disappear -> run return function

  // document.addEventListener('keyup',(event) => {
  //   // event.keyCode or event.which will have the code of the key
  //   // let keycode = event.keyCode || event.which;

  //   // Keypress event for confirm button
  //   const confirmBtn = document.querySelector('.popup__inner-confirm');
  //   if (confirmBtn){
  //     confirmBtn.dispatchEvent(new Event('click'));
  //     console.log(confirmBtn);
  //   }
  //   // Keypress event for ....
  // })
  

  return (
    <div className="popup">
      <div className="popup__inner">
        <div className="popup__inner-header">Notification</div>
        <div className="popup__inner-btn">
            {props.popup.hasBtns &&
                <button
                  className="popup__inner-confirm btn btn-success"
                  onClick={handleConfirmDelete}
                >
                Confirm
                </button>
            }   
                <button
                className="popup__inner-close btn btn-danger"
                onClick={closePopup}
                >
                Close
                </button>
        </div>
        {props.children}
        <p>{props.popup.title}</p>
      </div>
    </div>
  ) ;
}

export default Popup