import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { FC } from "react";
import { AppState } from './redux/store';
import { Dispatch } from 'redux';
import axios from 'axios'
import io from "socket.io-client";
import * as _ from 'lodash'

import { createMuiTheme } from '@material-ui/core/styles';
import { useStyles } from './materialStyles'

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';


import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { ReactSortable, } from "react-sortablejs";




import './App.css';
import NoteCard from './NoteCard';


import SortableGrid from './SortableGrid'

interface NoteType {
  author: string;
  title: string;
  content: string;
  id: number;
  order: number
}

const ENDPOINT = "http://localhost:5000";

let socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

const App = (props: any) => {

  const classes = useStyles();
  const [response, setResponse] = useState("");

  const [notes, setNotes] = useState<NoteType[]>([])
  const [connected, setConnected] = useState(false)

  // const theme = createMuiTheme();

  useEffect(() => {

    const ENDPOINT = "http://localhost:5000";

    socket = io(ENDPOINT, {
      reconnection: true
    });

    socket.emit("initial_data");


    socket.on("FromAPI", data => {
      setResponse(data);
    });

    socket.on('disconnect', () => {
      // socket.emit("initial_data");
      setConnected(false)
    })

    socket.on('connect', () => {
      socket.emit("initial_data");
      setConnected(true)

    })

    socket.on("updateNotes", notes => {
      setNotes(notes)
    }
    )

  }, [])

  const [inputText, setInputText] = useState("");

  const onAddClick = () => {
    let min = 1
    let max = 2
    let order = 0
    if (notes.length > 0) {
      min = Math.max(...notes.map(note => note.id)) + 1
      max = min * 2
      order = Math.max(...notes.map(note => note.order)) + 1
    }

    const data: NoteType = {
      id: Math.floor(Math.random() * (max - min + 1) + min),
      author: "Anon",
      content: "Dolor sit amet",
      title: "Title",
      order: order
    }

    const newNotes = notes.concat(data)

    socket.emit('add_note', data)
    setNotes(newNotes)
  }

  const onDeleteClick = (id: number) => {
    const newNotes = _.filter(notes, note => note.id != id)
    socket.emit('delete_note', id)
    setNotes(newNotes)
    // saveNotes(newNotes)
  }

  const onModifyNote = (id: number, data) => {
    let tempNotes = _.filter(notes, note => note.id != id)

    const max_order = Math.max(...notes.map(note => note.order)) + 1

    const modifiedNote = {
      id: id,
      title: data.title,
      content: data.content,
      author: data.author,
      order: data.order
    }

    let newNotes = tempNotes.concat(modifiedNote)
    newNotes = _.sortBy(newNotes, note => note.order)
    socket.emit('update_note', id, data)
    saveNotes(newNotes)
  }

  const saveNotes = (data) => {
    socket.emit('update_notes', data)
  }

  const socketConnect = () => {
    socket.connect()
  }

  const socketDisconnect = () => {
    socket.disconnect()
  }

  const SetAppNotes = (data) => {
    setNotes(data)
  }

  return (
    <div className="app">
      <div className="app-container">
        <Typography variant='h3'>
          Notes app
        </Typography>
        <div>
          <Grid container justify='center' spacing={2}>
            <Grid item >
              <Button color="primary" onClick={socketConnect} disabled={connected} variant="contained"> Connect</Button>
            </Grid>
            <Grid item >
              <Button className={classes.buttonStyle} color="primary" disabled={!connected} onClick={socketDisconnect} variant="contained"> Disconnect</Button>
            </Grid>
            <Grid item >
              < Button startIcon={<AddIcon />} onClick={onAddClick} color="secondary" variant="contained"> Add Note</Button>
            </Grid>
          </Grid>
        </div>
        {!connected && <span> Application is disconnected </span>}
        {connected && <span> Application connected </span>}
        <div className='grid-container'>
          {notes.length > 0 &&
            <SortableGrid noteList={notes} onModifyNote={onModifyNote} onDeleteClick={onDeleteClick} onSaveNotes={saveNotes} setAppNotes={SetAppNotes} />
          }
        </div>
      </div>
    </div >
  );
}


const mapStateToProps = ({ notes }: AppState) => {
  const { notesList, loading } = notes;
  return { notesList, loading };
}

export default connect(mapStateToProps)(App);
