import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    console.log('got error here');
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log('da err', { error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    console.log('rendered');
    if (this.state.hasError) {
      // You can render any custom fallback UI
      console.log('err');
      window.location.reload();
      return <></>;
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
