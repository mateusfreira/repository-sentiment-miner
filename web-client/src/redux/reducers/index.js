import _ from 'lodash';
import { RECEIVE_PROJECTS, RECEIVE_PROJECT } from '../actions';

const initialState = {};
const actionsMap = {
  [RECEIVE_PROJECTS]: (state, action) =>
    Object.assign({}, state, {
      projects: action.projects
    }),
  [RECEIVE_PROJECT]: (state, action) =>
    Object.assign({}, state, {
      project: action.project
    }),
  chartReducer: (state, action) =>
    Object.assign({}, state, _.omit(action, 'type'))
};
const rootReducer = (state = initialState, action) => {
  const currentAction = actionsMap[action.type] || actionsMap.chartReducer;
  if (currentAction) return currentAction(state, action);
  return state;
};
export default rootReducer;
