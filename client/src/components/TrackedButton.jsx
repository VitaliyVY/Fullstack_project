import { useState } from 'react';

/**
 * Google Tag Manager dataLayer tracking hook
 * Ensures dataLayer exists before pushing data
 */
const useDataLayerPush = () => {
  const pushToDataLayer = (data) => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(data);
    }
  };

  return pushToDataLayer;
};

/**
 * Example component with GTM tracking
 */
export default function TrackedButton() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const pushToDataLayer = useDataLayerPush();

  const handleClick = () => {
    // Push event to dataLayer
    pushToDataLayer({
      event: 'button_click',
      button_name: 'submit_form',
    });

    setIsSubmitted(true);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSubmitted}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
    >
      {isSubmitted ? 'Submitted!' : 'Submit Form'}
    </button>
  );
}