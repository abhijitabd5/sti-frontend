// RichTextEditor.jsx

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';
import './RichTextEditor.css'; // Import the shared CSS

/**
 * A flexible, reusable Rich Text Editor component using TinyMCE.
 * * Note: You should replace 'YOUR_TINYMCE_API_KEY' with your actual API key 
 * to remove the "This editor is powered by TinyMCE" branding in a production environment.
 */
const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Enter text...",
  height = 200, // TinyMCE uses a number for height in pixels
  className = "",
  disabled = false,
  error = false,
  id = "",
  name = "",
  darkMode = false, // Prop for dark mode
}) => {
  // TinyMCE toolbar and plugin configuration to match your Quill setup:
  // Headings (formatselect), Bold (bold), Text Color (forecolor), List (bullist), Remove Formatting (removeformat)
  const toolbarConfig = 
    'formatselect bold forecolor bullist | removeformat';
  
  const pluginsConfig = 
    'autoresize lists textcolor colorpicker';
    
  // Combine class names for styling the wrapper
  const combinedClassName = [
    'rich-text-editor',
    disabled ? 'disabled' : '',
    error ? 'error' : '',
    className
  ].filter(Boolean).join(' ');

  // Dynamic styles for the wrapper to control overall dimensions
  const wrapperStyle = {
    // The height will be controlled by TinyMCE's 'height' prop, 
    // but the wrapper helps with layout/margin.
    minHeight: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={combinedClassName} style={wrapperStyle}>
      <Editor
        apiKey="qtdkhsicme4e6iiro0zbpbn228c8mja6d7lz9ealyldne0fw" // **IMPORTANT:** Replace this with your actual API key
        id={id}
        initialValue={value}
        onEditorChange={onChange} // TinyMCE's change handler
        disabled={disabled}
        init={{
          // Editor Layout and Appearance
          height: height,
          menubar: false,
          toolbar: toolbarConfig,
          plugins: pluginsConfig,
          placeholder: placeholder,
          skin: darkMode ? 'oxide-dark' : 'oxide',
          content_css: darkMode ? 'dark' : 'default',
          directionality: 'ltr',

          // Content and Styles
          // Custom styles for headings to match your Quill setup (optional, but good for consistency)
          block_formats: 'Normal=p; Heading 1=h1; Heading 2=h2; Heading 3=h3',
          
          // Accessibility and Usability
          branding: false,
          statusbar: false,
          resize: false, // Disables the resize handle in the corner
          
          // Custom class for the editor content area to apply custom CSS
          body_class: 'tinymce-custom-editor-body', 
        }}
      />
      {/* Hidden input to hold the value for form submissions, using the 'name' prop */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
};

RichTextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  darkMode: PropTypes.bool,
};

export default RichTextEditor;