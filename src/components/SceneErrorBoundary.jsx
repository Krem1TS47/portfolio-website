import { Component } from 'react'

/** Renders the fallback if the 3D scene throws (lost context, shader error…). */
class SceneErrorBoundary extends Component {
    state = { failed: false }

    static getDerivedStateFromError() {
        return { failed: true }
    }

    componentDidCatch(error) {
        if (import.meta.env.DEV) console.error('[PlanetScene]', error)
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children
    }
}

export default SceneErrorBoundary
