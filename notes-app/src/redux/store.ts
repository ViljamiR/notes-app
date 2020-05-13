import { combineReducers, createStore } from 'redux';
import { notesReducer } from './notes/reducer';
import { NotesState } from './notes/types';
export interface AppState {
    notes: NotesState
}
const store = createStore<AppState, any, any, any>(
    combineReducers({
        notes: notesReducer
    }));
export default store;