import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "#e5faff", background: "#020617", minHeight: "100vh" }}>
          <h2>Something went wrong</h2>
          <p>There was an unexpected error loading this page.</p>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error)}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
