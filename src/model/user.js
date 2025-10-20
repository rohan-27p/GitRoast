import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    image : String,
    githubId : {type :String, unique:true},
    githubAccessToken : String, //ill store this to make api calls on behalf of dummos
})

export default mongoose.models.User || mongoose.model('User', userSchema)