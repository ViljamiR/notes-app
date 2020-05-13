import { Constants, NotesActions, NotesState } from './types';
const initState: NotesState = {
    notesList: [],
    loading: false
};


export const notesReducer = (state: NotesState = initState,
    action: NotesActions): NotesState => {
    switch (action.type) {
        case Constants.ADD_ITEM:
            return {
                ...state,
                notesList: [...state.notesList, action.payload.item],

            }
        case Constants.SET_LOADING:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}