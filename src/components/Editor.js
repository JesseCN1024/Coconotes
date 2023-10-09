import React from "react";
import Toast from './Toast';
import html2canvas from "html2canvas";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

export default function Editor(props) {
    // const {toPDF, targetRef} = usePDF({filename:'page.pdf'});

    function handleChange(event){
      props.setTempNoteText(event.target.value);
    }
    function showToast(title){
      props.setToast(prev => ({
        trigger: (!props.toast.isHanging), // if isHanging -> trigger: false it
        title,
        isHanging:true
      }))
    }
    function copyToClipBoard(){
      if (props.currNote){
        if (navigator.clipboard){
          navigator.clipboard.writeText(props.currNote.body);
          showToast("Copied to clipboard!");
        }
      } 
      else{ 
        showToast("Failed to copy!");
      }
    }
    function eraseContent(){
      if (props.currNote){
        props.setTempNoteText("");
        showToast('Cleared all content!')
      }
    }
    function insertDateTime(){
      const textarea = document.querySelector('textarea');
      textarea.focus();
      if (document.activeElement === textarea){
        const selection = textarea.selectionStart; // get the position of the pointer
        const value = props.tempNoteText;
        const before = value.substring(0, selection);
        const after = value.substring(selection);
        const date = new Date().toDateString();
        const time = new Date().toTimeString();
        const newDateTime = "\n" + date + "\n" + time + "\n";
        const newText = before + newDateTime + after;
        props.setTempNoteText(newText);
        showToast("Date/time inserted!");
      }
    }
    const currTitle = props.currNote?.title.toLowerCase().replace(/\s/g, "-");
    const options = {
      filename: `${currTitle}.pdf`,
      // default is `save`, others: 'open'
      method: "save",
      // default is Resolution.MEDIUM = 3, which should be enough, higher values
      // increases the image quality but also the size of the PDF, so be careful
      // using values higher than 10 when having multiple pages generated, it
      // might cause the page to crash or hang.
      resolution: Resolution.LOW,
      page: {
        // margin is in MM, default is Margin.NONE = 0
        margin: Margin.SMALL,
        // default is 'A4', 'letter',,...
        format: "A4",
        // default is 'portrait', 'landscape'
        orientation: "portrait",
      },
      canvas: {
        // default is 'image/jpeg' for better size performance
        mimeType: "image/png",
        qualityRatio: 1,
      },
      // Customize any value passed to the jsPDF instance and html2canvas
      // function. You probably will not need this and things can break,
      // so use with caution.
      // overrides: {
      //   // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      //   pdf: {
      //     compress: true,
      //   },
      //   // see https://html2canvas.hertzen.com/configuration for more options
      //   canvas: {
      //     useCORS: true,
      //   },
      // },
    };


    return (
      <div className="editor">
        <div className="editor__header border-bottom border-success border-1 d-flex align-items-center">
          {/* Toolbar */}
          <ul className="editor__tool">
            {/* Copy all */}
            <li className="editor__tool-item">
              <button 
                className="editor__tool-btn" 
                onClick={copyToClipBoard}
                title="Copy all"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
            </li>
            {/* Clear all  */}
            <li className="editor__tool-item">
              <button 
                className="editor__tool-btn"
                onClick={eraseContent}
                title="Clear all"
              >
                <i className="fa-solid fa-eraser"></i>
              </button>
            </li>
            {/* Insert date/time */}
            <li className="editor__tool-item">
              <button 
                className="editor__tool-btn"
                onClick={insertDateTime}
                title="Insert date/time"
              >
                <i className="fa-solid fa-clock"></i>
              </button>
            </li>
            {/* Export pdf */}
            <li className="editor__tool-item">
              <button 
                className="editor__tool-btn"
                onClick={() => generatePDF(() => document.querySelector('.viewer__content'), options)}
                title="Export to pdf"
              >
                <i className="fa-solid fa-file-pdf"></i>
              </button>
            </li>
            {/* Toggle markdown */}
            <li className="editor__tool-item">
              <button 
                className="editor__tool-btn"
                onClick={() => {
                  props.setViewerOn((prev) => !prev);
                  showToast(props.viewerOn ? "Toggled markdown off!" : "Toggled markdown on!")
                }}
                title="Toggle viewer on/off"
              >
                <i className="fa-solid fa-eye"></i>
              </button>
            </li>
          </ul>
          {/* Saving state */}
          <div className="editor__saving d-flex align-items-center ms-2 d-none">
            <span className="editor__saving-text me-2 m-0">Saving</span>
            <div className="spinner spinner-border spinner-grow-sm spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        {props.currNote ? (
          <textarea
            className={`editor__textarea`}
            value={props.tempNoteText}
            placeholder="Input Markdown Text..."
            onChange={handleChange}
          ></textarea>
        ) : (
          <p>Add a note to start writing</p>
        )}
      </div>
    );
}