import mongoose from 'mongoose'

const artworkSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: [true,'title must be unique'],
        trim: true,
        required: [true,'title is required'],
        minLength:[2,'too short artwork\'s title']
    },
    artist_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Artist'
    },
    year: {
        type: Number,
        required: [true, 'year is required'],
        min: 1900
    },
    medium: {
        type: String,
        trim: true,
        required: [true, 'medium is required']
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
        min: 0
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'description is required']
    }
})

const artworkModel = mongoose.model("Artwork",artworkSchema)

export default artworkModel