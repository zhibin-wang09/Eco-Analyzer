import React from "react";
import "./Modal.css";

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div className="modal">
      <div onClick={onClose} className="overlay"></div>
      <div className="modal-content">
        <h2>Welcome to Our Electoral Data Visualization Tool</h2>
        <p>
          This interactive tool allows you to explore electoral data for Arkansas (red) and New York (blue). 
          Here's a quick guide to help you navigate:
        </p>
        
        <h3>Map Features:</h3>
        <ul>
          <li>Zoom: Use the + and - buttons or scroll to zoom in and out of the map.</li>
          <li>State Colors: Red represents Republican-leaning Arkansas, while blue represents Democratic-leaning New York, following standard electoral color coding.</li>
          <li>Precinct Toggle: Use the "Toggle Precincts" button to show or hide precinct boundaries within each state.</li>
        </ul>
        
        <h3>Data Visualization:</h3>
        <ul>
          <li>Click on a state to view detailed charts on income, age, and race demographics.</li>
          <li>Each chart provides a breakdown of the selected data for the chosen state.</li>
        </ul>
        
        <h3>Performance Note:</h3>
        <p>
          Displaying precincts may cause lag on some devices. For smoother performance, consider turning off the precinct overlay 
          and zooming into your area of interest before re-enabling it.
        </p>
        
        <h3>Accessibility Features:</h3>
        <ul>
          <li>High contrast colors for easy distinction between states and UI elements.</li>
          <li>Responsive design for use on various devices and screen sizes.</li>
          <li>Keyboard navigation support for all interactive elements.</li>
        </ul>
        
        <p>We hope this guide helps you make the most of our tool. Enjoy exploring the electoral landscape!</p>
        
        <button className="close-modal" onClick={onClose}>
          CLOSE
        </button>
      </div>
    </div>
  );
}

export default Modal;