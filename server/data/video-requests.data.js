const VideoRequest = require('./../models/video-requests.model');
const User = require ('./../models/user.model');

module.exports = {
createRequest: async (vidRequestData) => {
    const authorId = vidRequestData.author_id;
    if (authorId) {
        const userObj = await User.findOne({ _id: authorId });
        vidRequestData.author_name = userObj.author_name;
        vidRequestData.author_email = userObj.author_email;
    }
    let newRequest = new VideoRequest(vidRequestData);
    return newRequest.save();
},

getAllVideoRequests: (top) => {
    return VideoRequest.find({}).sort({ submit_date: '-1' }).limit(top);
},

searchRequests: (topic) => {
    return VideoRequest.find({ topic_title: {
    $regex: topic,
    $options: /i/
    } })
    .sort({ addedAt: '-1' })
},

getRequestById: (id) => {
    return VideoRequest.findById({ _id: id });
},

updateRequest: (id, status, resVideo) => {
    const updates = {
    status: status,
    video_ref: {
        link: resVideo,
        date: resVideo && new Date(),
    },
    };

    return VideoRequest.findByIdAndUpdate(id, updates, { new: true });
},

updateVoteForRequest: async (id, vote_type, userId) => {
    const oldRequest = await VideoRequest.findById({ _id: id });
    const other_type = vote_type === 'ups' ? 'downs' : 'ups';


    // Convert to set for easier methods
    oldSelectedVoteArray = new Set(oldRequest.votes[vote_type]); 
    // If it already includes the user id.. remove him. if not add him
    oldSelectedVoteArray.has( userId ) ? oldSelectedVoteArray.delete( userId ): oldSelectedVoteArray.add( userId );
    // Return back to array
    newSelectedVoteArray = [...oldSelectedVoteArray];


    // Delete from other type w 5alas
    oldOtherVoteArray = new Set(oldRequest.votes[other_type]); 
    oldOtherVoteArray.delete( userId );
    // Return back to array
    newOtherVoteArray = [...oldOtherVoteArray];



    return VideoRequest.findByIdAndUpdate(
    { _id: id },
    {
        votes: {
            [vote_type]: newSelectedVoteArray,
            [other_type]: newOtherVoteArray,
        },
    },
    { new: true }
    );
},

deleteRequest: (id) => {
    return VideoRequest.deleteOne({ _id: id });
},
};
