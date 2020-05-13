import { Dispatch } from 'redux';
import * as actions from './actions';
import { NotesActions } from './types';

function sleep(timeout: number) {
    return new Promise((resolve) => setTimeout(() => resolve(), timeout));
}

export async function addItemAsync(dispatch: Dispatch<NotesActions>, item: string) {
    dispatch(actions.setLoading(true));

    await sleep(1000);
    dispatch(actions.addNoteToList(item));
    dispatch(actions.setLoading(false));
}