import artistModel from "../../../../database/models/artist/artist.model.js"
import artworkModel from "../../../../database/models/artwork/artwork.model.js"

const getAllArtist = async (req,res)=>{
    const artists = await artistModel.find()
    res.status(200).json({message:"Successful showing",artists})
} 

const getAllArtistWithArtworks = async(req,res)=>{
    const artists = await artistModel.find();
        const artistsWithArtworks = await Promise.all(
            artists.map(async (artist) => {
                const artworks = await artworkModel.find({ artist_id: artist._id });
                return { ...artist.toObject() , artworks };
            })
        );
    res.status(200).json({ message: "Successful showing", artists: artistsWithArtworks });
}

const getArtistById = async (req, res) => {
    const id = req.params.id;
    if (!id)    return res.status(400).json({ message: "Artist ID is required" });
    const artist = await artistModel.findById(id);
    if (!artist)    return res.status(404).json({ message: "Artist not found" });
    const artworks = await artworkModel.find({ artist_id: artist._id });
    const artistWithArtworks = {...artist.toObject(),artworks};
    res.status(200).json({ message: "Successful showing", artist: artistWithArtworks });
}

const addArtist = async (req,res)=>{
    try{
        const {name,bio,contact} = req.body
        const artist = await artistModel.insertMany({name,bio,contact})
        res.status(201).json({message:"Successful adding" ,artist})
    }catch (error) {
        return res.status(400).json({ message: "Validation failed", error });
    }
}

const deleteArtist = async (req,res)=>{
    const id = req.params.id
    if (!id)    return res.status(400).json({ message: "Artist ID is required" });
    const deletedArtworks = await artworkModel.deleteMany({artist_id: id})
    const deleted = await artistModel.deleteOne({_id:id})
    res.status(200).json({message:"Successful deleting",deleted,deletedArtworks})
    //found deletedCount 1 , not found deletedCount 0
}

export {getAllArtist ,addArtist ,deleteArtist,getAllArtistWithArtworks,getArtistById}
