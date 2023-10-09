import React from "react"
import ReactMarkdown from "react-markdown"
import { usePDF } from "react-to-pdf";

export default function Viewer(props) {
    // const { targetRef } = usePDF({ filename: "page.pdf" });
    const viewerOnRendered = (
      <ReactMarkdown >{props.tempNoteText || ""}</ReactMarkdown>
    );
    const viewerOffRendered = (
      <div className="w-100 h-100 d-flex align-items-center justify-content-center mt-3">
        <i className="fa-solid fa-eye-slash text-secondary"></i>
      </div>
    );
    return (
        <div className="viewer">
            <div className="viewer__content">
                {props.viewerOn ? viewerOnRendered : viewerOffRendered}
            </div>
        </div>
    )
}