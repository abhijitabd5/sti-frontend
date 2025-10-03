// ExampleUsage.jsx

import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';

/**
 * Example usage of the RichTextEditor component
 */
const ExampleUsage = () => {
  const [content, setContent] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [disabledContent, setDisabledContent] = useState('This editor is disabled, but still shows content.');

  return (
    // The 'dark' class on the container enables the dark mode CSS
    <div className={`p-6 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">RichTextEditor Example (TinyMCE)</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
        <p className="text-sm mt-2 text-red-500">
          *Remember to replace 'YOUR_TINYMCE_API_KEY' in RichTextEditor.jsx.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Course Description (Basic Usage)
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Enter course description..."
          darkMode={darkMode}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Course Syllabus (Custom Height - 300px)
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Enter detailed course syllabus..."
          height={300} // TinyMCE takes a number (pixels)
          darkMode={darkMode}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Disabled State
        </label>
        <RichTextEditor
          value={disabledContent}
          onChange={setDisabledContent}
          disabled={true}
          darkMode={darkMode}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Error State
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="This field has an error..."
          error={true} // Renamed from hasError to error for simpler prop name
          darkMode={darkMode}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Current HTML Content:</h3>
        <div 
          className={`p-4 rounded border ${
            darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
          }`}
          // This shows the raw HTML output
          dangerouslySetInnerHTML={{ __html: content || 'No content yet...' }}
        />
      </div>
    </div>
  );
};

export default ExampleUsage;