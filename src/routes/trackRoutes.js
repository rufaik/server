const express = require('express')
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth')

const Track = mongoose.model('Track')

const router = express.Router();

//requires user to be signed in
router.use(requireAuth);

//gets all the different tracks for that user
router.get('/tracks', async (req, res) => {
	//finds all the the different tracks where the user is is req.user._id
	const tracks = await Track.find({ userId: req.user._id })

	//responds (res) with all those tracks
	res.send(tracks);
});

//user can create a new track
router.post('/tracks', async(req, res) => {
	const { name, locations } = req.body

	if (!name || !locations) {
		return res
			.status(422)
			.send({ error: 'You must provide a name and locations' })
	}
	try {
		const track = new Track({ name, locations, userId: req.user._id })
		await track.save();
		res.send(track);
	} catch (err) {
		res.status(422).send({ error: err.message })
	}
})

module.exports = router;

