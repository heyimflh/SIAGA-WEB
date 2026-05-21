/**
 * AssetMapErrorBoundary — React class component error boundary for Section B.
 *
 * Catches:
 * - Chunk-load errors (dynamic import failures from React.lazy)
 * - Mapbox initialization errors (token invalid, WebGL unsupported)
 * - Runtime Mapbox errors (style load failures, tile fetch errors)
 *
 * On error, renders <AssetMapFallback variant="error" assets={...} />.
 *
 * Spec: .kiro/specs/client-dashboard
 * Requirements: 5.18, 15.5
 *
 * Props:
 * children: React node (the lazy-loaded map component)
 * assets: Array<{ nama: string, status: string }> — passed to fallback
 */

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
 // Log for debugging in development; swallow in production.
 // The fallback UI is the UX contract .
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
