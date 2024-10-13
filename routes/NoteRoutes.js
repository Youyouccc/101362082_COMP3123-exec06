const noteModel = require('../models/NotesModel.js');
const express = require('express');
const app = express();

//http://mongoosejs.com/docs/api.html#document_Document-save
app.post('/notes', async (req, res) => {
    //create new note instance
    const note = new noteModel(req.body);

    try {
        // Save the note to the database
        await note.save()
        res.send(note)
    } catch (error) {
        res.status(500).send({message: error.message})
    }
});


//Retrieve all Notes
//http://mongoosejs.com/docs/api.html#find_find
app.get('/notes', async (req, res) => {
    // Validate request
    noteModel.find()
        .then(notes => {
            res.status(200).send(notes); //return all notes
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes"
            });
        });
});

// Retrieve a single Note with noteId
//http://mongoosejs.com/docs/api.html#findbyid_findById
app.get('/notes/:noteId', (req, res) => {
    // Validate request
    const noteId = req.params.noteId;
    noteModel.findById(noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note cannot be found with id: " + noteId
                });
            }
            res.status(200).send(note); //else return the note
        })
        .catch(err => {
            return res.status(500).send({
                message: "Retrieving note with id went error"
            });
        });
    
});




//Update a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandupdate_findByIdAndUpdate
app.put('/notes/:noteId', async (req, res) => {
    try {
        await noteModel.findByIdAndUpdate(req.params.noteId, req.body)
        await noteModel.save()
        res.status(200).send(note); // Return the updated note
    } catch (err) {
        res.status(500).send(err)
    }
});




//Delete a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandremove_findByIdAndRemove
app.delete('/notes/:noteId', async (req, res) => {
    // delete the note
    try {
        const note = await noteModel.findByIdAndDelete(req.params.noteId)
        // Validate request
        if (!note) res.status(400).send("Note not found")
        res.status(200).send({
                message: "Note deleted successfully!"
        }); // Return a success message

    } catch (err) {
        res.status(500).send(err)
    } 
});


module.exports = app;
