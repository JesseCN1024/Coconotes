import React from "react"

export default function Toast(props){
  let isHangingTemp = props.toast.isHanging;
  React.useEffect(() => {
    // Css slider
    const timeoutSlider = 3;
    const slider = document.querySelector('.toaster__slider');
    slider.style.animationDuration = `${timeoutSlider}s`;
    // Temporary var for toast.isHanging to check it is 
    const timer = setTimeout(() => {
      props.setToast(prev => ({...prev, trigger:false, isHanging: false}))
      isHangingTemp = false; 
    }, timeoutSlider*1000)
    return () => {
      // If isHanging -> button clicked -> trigger: false it and then true it here
      if (isHangingTemp) props.setToast(prev => ({...prev, trigger:true}));
      clearTimeout(timer);
    }
  }, [])
    return (
      <div
        className={`toaster toaster-animation d-flex justify-content-between align-items-center border border-success`}
      >
        <span className="me-2">{props.toast.title}</span>
        {/* Hide Toast Button */}
        <button
          className="border border-danger text-danger ms-auto d-flex align-items-center justify-content-center"
          onClick={() =>{
            props.setToast((prev) => ({
              ...prev,
              trigger: false,
              isHanging: false,
            }));
            isHangingTemp = false;
          }
          }
        >
          <i className="fa-solid fa-x m-auto"></i>
        </button>
        {/* Toast Slider */}
        <div className="toaster__slider toaster__slider-animation"></div>
      </div>
    );
}