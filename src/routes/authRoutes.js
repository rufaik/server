const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = new User({ email, password });
		await user.save();

		const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY') 
		res.send({ token });
	} catch (err) {
		return res.status(422).send(err.message)
	}
	
});

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(422).send({ error: 'Must provide email and password' })
	}

	 const user = await User.findOne({ email })
	 if(!user) {
	 	return res.status(422).send({ error: 'Invalid password or email' })
	 }
	 try {
	 	await user.comparePassword(password);
	 	const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY')
	 	res.send({ token });
	 } catch (err) {
	 	return res.status(422).send({ error: 'Invalid password or email' })
	 }
});


router.put('/reset', async(req, res) => {
	const { email, newpassword } = req.body;

		User.findOne({email}, (err, user) => {

			const obj = {
				password: newpassword
			}

			user = _.extend(user, obj);
			user.save((err, result) => {
				if (err) {
					return res.status(422).send({ error: 'Reset Password Error' })
				} else {
					return res.status(200).send({ message: 'Your password has been changed' })
				}
			})
		})
})


module.exports = router;