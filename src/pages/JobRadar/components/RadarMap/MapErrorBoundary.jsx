import { Component } from 'react';
import MapErrorFallback from './MapErrorFallback.jsx';

export default class MapErrorBoundary extends Component {
 constructor(props) {
 super(props);
 this.state = { hasError: false, error: null };
 }

 static getDerivedStateFromError(error) {
 return { hasError: true, error };
 }

 componentDidCatch(error, errorInfo) {
 console.error('[MapErrorBoundary] Map failed to load:', error, errorInfo);
 }

 handleRetry = () => {
 this.setState({ hasError: false, error: null });
 };

 render() {
 if (this.state.hasError) {
 return <MapErrorFallback onRetry={this.handleRetry} />;
 }
 return this.props.children;
 }
}
