import * as actionTypes from './actionTypes';
import * as actions from './actions';

const routerPlugin = dispatch =>
    router => ({
        name: 'REDUX_PLUGIN',
        onTransitionStart(toState, fromState) {
            dispatch(actions.transitionStart(toState, fromState));
        },
        onTransitionSuccess(toState, fromState) {
            dispatch(actions.transitionSuccess(toState, fromState));
        },
        onTransitionError(toState, fromState, err) {
            dispatch(actions.transitionError(toState, fromState, err));
        }
    });

const router5ReduxMiddleware = router =>
    store => {
        const { dispatch } = store;
        router.setAdditionalArgs(store);
        router.usePlugin(routerPlugin(dispatch));


        return next => action => {
            if (action.type === actionTypes.NAVIGATE_TO) {
                router.navigate(action.name, action.params, action.opts);
            } else if (action.type === actionTypes.CANCEL_TRANSITION) {
                router.cancel();
            }

            return next(action);
        };
    }

export default router5ReduxMiddleware;
