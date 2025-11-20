import React from 'react';

class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a chunk loading error
    if (error?.name === 'ChunkLoadError' || error?.message?.includes('Loading chunk')) {
      return { hasError: true, error };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chunk loading error:', error, errorInfo);
  }

  handleRetry = () => {
    // Clear the error state and try to reload
    this.setState({ hasError: false, error: null });
    
    // If it's a chunk error, reload the page
    if (this.state.error?.name === 'ChunkLoadError' || 
        this.state.error?.message?.includes('Loading chunk')) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Loading Error
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There was an error loading this page. This might be due to a network issue or an updated version of the application.
            </p>
            <button
              onClick={this.handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;