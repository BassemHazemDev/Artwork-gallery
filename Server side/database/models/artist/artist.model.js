import mongoose from 'mongoose'

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true,'name must be unique'],
        trim: true,
        required: [true,'name is required'],
        minLength:[2,'too short artist\'s name']
    },
    bio: {
        type: String,
        trim: true,
        required: [true,'bio is required'],
        minLength:[10,'too short artist\'s bio']
    },
    contact:{
        type: String,
        unique: [true,'contact is required'],
        trim: true,
        required: [true,'contact is required'],
        minLength:[11,'Non-correct contact number']
    }
})

const artistModel = mongoose.model("Artist",artistSchema)

export default artistModel

