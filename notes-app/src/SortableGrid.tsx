import React, { FunctionComponent, useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import NoteCard from './NoteCard'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import styled from "styled-components";
import arrayMove from 'array-move'
import Grid from '@material-ui/core/Grid/Grid';
import * as _ from 'lodash'

interface NoteType {
    author: string;
    title: string;
    content: string;
    id: number;
    order: number
}

const DragHandle = SortableHandle(() => <span>::</span>);

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  min-height: 500px;
`;

const SortableItem = SortableElement(({ note, onDeleteClick, onModifyNote, edit }:
    { note: any, onDeleteClick: Function, onModifyNote: Function, edit: boolean }) =>
    <Grid item >
        <DragHandle />
        <NoteCard disabled={edit} note={note} onDeleteClick={onDeleteClick} onModifyNote={onModifyNote} />
    </Grid>
);

const SortableList = SortableContainer(({ notes, onModifyNote, onDeleteClick, edit, setAppNotes }:
    { notes: any[], onModifyNote: Function, onDeleteClick: Function, edit: boolean, setAppNotes: Function }) => {

    return (
        <Grid container justify='center' spacing={2}>
            {notes.map((note, index) => (
                <SortableItem disabled={!edit} edit={edit} key={`item-${index}`} index={index} note={note} onModifyNote={onModifyNote} onDeleteClick={onDeleteClick} />
            ))}
        </Grid>
    );
});

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

const SortableComponent = ({ noteList, onDeleteClick, onModifyNote, onSaveNotes, setAppNotes }) => {

    const [notes, setNotes] = useState([])
    const [edit, setEdit] = useState(false)

    useForceUpdate()

    useEffect(() => {
        setNotes(noteList)

    }, [noteList])

    const saveNotes = () => {
        const newNotes = notes.map((note: NoteType, i: number) => {
            const title = note.title
            const content = note.content
            const author = note.author
            const order = i
            const id = note.id

            return { id, title, content, author, order }
        });
        onSaveNotes(newNotes)

        setEdit(!edit)
    }

    const onSortOver = ({ index, oldIndex, newIndex, collection, isKeySorting }, e) => {
        console.log(notes);

        setAppNotes(
            arrayMove(notes, oldIndex, newIndex),
        );
    }

    const onSortEnd = () => ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
        setAppNotes(
            arrayMove(notes, oldIndex, newIndex),
        );

    };

    const toggleEdit = () => {
        setEdit(!edit)
    }

    const cancelEdit = () => {

    }

    return (
        <Container>
            {
                edit && (
                    <>
                    <Button variant="contained" onClick={saveNotes}>Save order</Button>
                    {/* <Button variant="contained" onClick={toggleEdit}>Cancel</Button> */}
                    </>
                )
            }
            {
                !edit &&
                <Button variant="contained" onClick={toggleEdit}>Edit order</Button>
            }
            <SortableList edit={edit} notes={notes}
                onSortOver={onSortOver} onSortEnd={onSortEnd}
                onDeleteClick={onDeleteClick} onModifyNote={onModifyNote}
                setAppNotes={setAppNotes} useDragHandle axis="xy" />
        </Container>
    )

}
export default SortableComponent