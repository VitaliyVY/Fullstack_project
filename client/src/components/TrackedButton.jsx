import { useState } from 'react';

/**
 * Reusable hook to safely push data to window.dataLayer
 * Ensures dataLayer exists before pushing
 * Works in browser and avoids SSR errors
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
 * Refactored component with GTM tracking for form and article clicks
 */
export default function TrackedButton() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const pushToDataLayer = useDataLayerPush();

  const handleFormSubmit = () => {
    // Track form_submit event
    pushToDataLayer({
      event: 'form_submit',
      form_name: 'contact_form',
    });

    setFormSubmitted(true);
  };

  const handleRelatedArticleClick = (articleName) => {
    // Track click_related_article event
    pushToDataLayer({
      event: 'click_related_article',
      article_name: articleName,
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Contact Form Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">Contact Form</h2>
        <input
          type="text"
          placeholder="Your name"
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Your email"
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={formSubmitted}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {formSubmitted ? 'Submitted!' : 'Submit Form'}
        </button>
      </form>

      {/* Related Articles Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Related Articles</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleRelatedArticleClick('Getting Started with React')}
              className="text-blue-600 hover:underline text-left"
            >
              Getting Started with React
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRelatedArticleClick('Advanced JavaScript Patterns')}
              className="text-blue-600 hover:underline text-left"
            >
              Advanced JavaScript Patterns
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}