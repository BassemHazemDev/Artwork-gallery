import artistModel from "../../../../database/models/artist/artist.model.js"
import artworkModel from "../../../../database/models/artwork/artwork.model.js"

const getAllArtwork =async (req,res)=>{
    const sortBy = req.params.sortBy
    let artworks
    if (sortBy=="price") artworks = await artworkModel.find().sort({ price: 1 });
    else artworks = await artworkModel.find().sort({ year: 1 });
    res.status(200).json({ message: "Successfully showing", artworks });
} 

const getArtworkByTitle = async (req, res) => {
    const title = req.params.title;
    if (!title)    return res.status(400).json({ message: "artwork title is required" });
    const artwork = await artworkModel.find({ title });
    if (!artwork)    return res.status(404).json({ message: "artwork not found" });
    res.status(200).json({ message: "Successful showing", artwork});
}

const getArtworkByArtist = async (req, res) => {
    const artist_id = req.params.id;
    if (!artist_id)    return res.status(400).json({ message: "artwork artist_id is required" });
    const artwork = await artworkModel.find({ artist_id });
    if (!artwork)    return res.status(404).json({ message: "artwork not found" });
    res.status(200).json({ message: "Successful showing", artwork});
}

const getAllArtworksAllArtists = async (req, res) => {
    const artworks = await artworkModel.find()
    const artworkswithArtist = await Promise.all(
        artworks.map(async (artwork)=>{
            const artist = await artistModel.find({_id: artwork.artist_id})
            return{ ...artwork.toObject(), artist}
        })
    )
    res.status(200).json({message:"Successful showing",artworks:artworkswithArtist})
}

const addArtwork = async (req,res)=>{
    try{
        const {title,artist_id,year,medium,price,description}=req.body
        const artwork = await artworkModel.insertMany({title,artist_id,year,medium,price,description})
        res.status(201).json({message:"Successful adding" ,artwork})
    }catch (error) {
      return res.status(400).json({ message: "Validation failed", error });
    }
}

const deleteArtwork = async (req,res)=>{
    const id = req.params.id
    if (!id)    return res.status(400).json({ message: "artwork ID is required" });
    const deleted = await artworkModel.deleteOne({ _id: id })
    res.status(200).json({message:"Successful deleting",deleted})
    //found deletedCount 1 , not found deletedCount 0
}
const salesReport =async (req,res)=>{
    const sum = await artworkModel.aggregate([{
                $group: {_id: null,totalPrice: { $sum: "$price" }}
            }]);
    res.status(200).json({ message: "Successfully reported", sum });
} 

export {getAllArtwork ,addArtwork ,deleteArtwork,getArtworkByTitle,getArtworkByArtist,getAllArtworksAllArtists,salesReport}