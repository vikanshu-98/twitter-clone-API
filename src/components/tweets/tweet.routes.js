import express from 'express'
import validate from '../../middleware/validate'   
import TweetValidation from './tweet.validation'
import TwitterController from './tweet.controller'
import auth from '../../middleware/auth'
const router  = express.Router() 

router.route('/feedTweets').get(auth(),validate(TweetValidation.getFeedTweets),TwitterController.getFeedTweets)

router.route('/')
.get(validate(TweetValidation.getTweets),TwitterController.getTwittes)
.post(auth(),validate(TweetValidation.createTwitter),TwitterController.createTwitter)


router.route('/like/:tweetId')
.get(auth(),validate(TweetValidation.likeValidation),TwitterController.likesTwitter)
.delete(auth(),validate(TweetValidation.likeValidation),TwitterController.unlikeTweet)

router.route('/:tweetId')
.get(validate(TweetValidation.likeValidation),TwitterController.getSingleTweet)
.patch(auth(),validate(TweetValidation.updateTweet),TwitterController.updateTweet)
.delete(auth(),validate(TweetValidation.likeValidation),TwitterController.deleteTweet)


 
export default  router