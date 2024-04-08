import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './scss/style.scss';
import './app.css';
import AuthHOC from './containers/auth_hoc/AuthHOC';
import { fetchDoctors, fetchTranslators } from './helpers';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}

export const loading = (
    <div className='apploader text-center'>
        <div className='spinner-border' role='status'>
            <span className='sr-only'>Loading...</span>
        </div>
    </div>
);

// Containers
const TheLayout = React.lazy(() => import('./containers/layout/TheLayout'));

class App extends Component {
    componentDidMount() {
        (async () => {
            const res = await fetch('/api/verify-token', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            });
            if (res.status === 200) {
                this.props.history.push('/dashboard');
            } else {
                this.props.history.push('/login');
            }

            const doctorsData = await fetchDoctors();
            this.props.saveDoctors(doctorsData);
            const translatorsData = await fetchTranslators();
            this.props.saveTranslators(translatorsData);
        })();
    }

    render() {
        return (
            <React.Suspense fallback={loading}>
                <Switch>
                    {/* Optional error boundary */}
                    <ErrorBoundary>
                        {/* Before a route is accessed, it goes through AuthHOC component first */}
                        <AuthHOC>
                            <Route
                                path='/'
                                name='Home'
                                render={(props) => <TheLayout {...props} />}
                            />
                        </AuthHOC>
                    </ErrorBoundary>
                </Switch>
            </React.Suspense>
        );
    }
}

/** Returns object.
 * key is state name that will be accessed in props
 * value is <state arg>.<reducer that is calling it>.<state>
 * eg: someVal: state.reducer.someVal
 * */
const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
    return {
        saveDoctors: (doctors) =>
            dispatch({ type: 'SAVE_DOCTORS_TO_CACHE', payload: doctors }),
        saveTranslators: (translators) =>
            dispatch({
                type: 'SAVE_TRANSLATORS_TO_CACHE',
                payload: translators,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
