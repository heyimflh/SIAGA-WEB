import { Component } from 'react';
import AssetMapFallback from './AssetMapFallback';

class AssetMapErrorBoundary extends Component {
 constructor(props) {
 super(props);
 this.state = { hasError: false };
 }

 static getDerivedStateFromError() {
 return { hasError: true };
 }

 componentDidCatch(error, errorInfo) {

 if (import.meta.env.DEV) {
 console.warn(
 '[AssetMapErrorBoundary] Caught error in map subtree:',
 error,
 errorInfo
 );
 }
 }

 render() {
 if (this.state.hasError) {
 return <AssetMapFallback variant="error" assets={this.props.assets} />;
 }
 return this.props.children;
 }
}

export default AssetMapErrorBoundary;
