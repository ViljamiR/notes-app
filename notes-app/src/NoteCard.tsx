import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            height: 140,
            width: 100,
        },
        control: {
            padding: theme.spacing(2),
        },
        card: {
            minWidth: 250,
            maxWidth: 250,
            minHeight: 150,
            maxHeight: 150
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
        headerStyle: {
            whiteSpace: 'nowrap',
        },
        button: {
            color: 'red'
        }

    }),
);


const NoteCard = ({ note, onDeleteClick, onModifyNote, disabled }:
    { note: any, onDeleteClick: Function, onModifyNote: Function, disabled: boolean }) => {


    let [currentNoteTitle, setNoteTitle] = useState(note.title)
    const [currentNoteContent, setNoteContent] = useState(note.content)
    const [edit, setEdit] = useState(false)


    useEffect(() => {
        setNoteTitle(note.title)
        setNoteContent(note.content)
        handleTitleChange(note.title)
        handleContentChange(note.content)

    }, [note.title, note.content])

    const handleTitleChange = (value) => {
        setNoteTitle(value);
    }

    const handleContentChange = (value) => {
        setNoteContent(value);
    }

    const handleUpdate = () => {
        const data = {
            author: note.author,
            content: currentNoteContent,
            title: currentNoteTitle,
            order: note.order,
        }
        onModifyNote(note.id, data)
        setEdit(false)
    }

    const classes = useStyles()
    return (
        <Card key={note.id} raised={true} className={classes.card}>
            {!edit &&
                <Typography className={classes.headerStyle} variant="h5">{currentNoteTitle}</Typography>
            }
            {edit && <TextField onChange={(e) => handleTitleChange(e.target.value)} id={`${note.id}`} defaultValue={currentNoteTitle} />}
            <CardContent>
                {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {note.title}
                </Typography> */}
                {!edit && <Typography>
                    {currentNoteContent}
                </Typography>}
                {edit &&
                    <TextareaAutosize rowsMin={3} aria-label="empty textarea" onChange={(e) => handleContentChange(e.target.value)} defaultValue={currentNoteContent} />
                }
            </CardContent>
            <CardActions>
                <Button className={classes.button} startIcon={<DeleteIcon />} disabled={disabled} onClick={() => onDeleteClick(note.id)} size="small">Delete</Button>
                {edit && <Button disabled={disabled} onClick={handleUpdate} size="small">Update</Button>}
                {!edit && <Button startIcon={<EditIcon />} disabled={disabled} onClick={() => setEdit(!edit)} size="small">Edit</Button>}
            </CardActions>
        </Card>
    )
}



export default NoteCard
