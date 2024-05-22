import React from 'react';
import '../CSS/HowToPlay.css';

const HowToPlayModal = ({ isOpen, onClose, text }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
<div className="modal-content">
  <h4>How to Play</h4>
  <div className="modal-body"> {/* Ajoute cette div pour le texte */}
    <p>{text}</p>
  </div>
  <button onClick={onClose}>Close</button>
</div>

    </div>
  );
};

export default HowToPlayModal;
