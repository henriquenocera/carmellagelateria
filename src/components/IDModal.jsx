import { useState } from 'react';
import "../css/IDModal.css";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Modal Title</h2>
            <p>Modal content goes here...</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};