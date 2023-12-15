import { Profile } from "." 
import ErrorHandler from "../../service/ErrorHandler" 
import { filter, pick } from "lodash"
import { Users } from "../users/index";
const ProfileController ={
    async getProfile(req,res,next){
        try{
            const {userId} = req.params
            const profilesData = await Profile.findOne({user:userId}).populate('user',['name','username','avatar'])
            if(!profilesData)
                next(ErrorHandler.notFound('profile not found'))
            return res.data(profilesData)
        }catch(err){
            next(err)
        }
    },
    async getProfiles(req,res,next){
        try{
            const options = pick(req.query,['limit','page','sortBy'])
            const filters =  pick(req.query,['following','followers','likes','retweets'])
            if(filters.followers && !(await Users.exists({_id:filters.followers})))
                next(ErrorHandler.notFound('user does not exists!!!'))

            if(filters.following && !(await Users.exists({_id:filters.following})))
                next(ErrorHandler.notFound('user does not exists!!!'))
            
            // if(filters.likes && Users.exists({_id:filters.following}))
            //     next(ErrorHandler.notFound('user does not exists!!!'))
            options.populate = {
                path: 'user',
                select: ['name', 'username', 'avatar'],
            }; 
            const result=await Profile.paginate(options,filters)
            res.data(result);
        }catch(err){
            next(err)
        }
    },

    async followProfile(req,res,next){
        try {
            const { userId } = req.params;
            const {_id:loginUserId}= req.user 
            if(userId===loginUserId.toString())
                next(ErrorHandler.badRequest('you can not follow own profile!!'))   
            
            const [AuthUserProfile,profileToFollow] = await Promise.all([
                Profile.find({user:loginUserId}),
                Profile.find({user:userId})
            ])
             
            if(!profileToFollow)
                next(ErrorHandler.notFound('profile does not exists!!!'))

            if(AuthUserProfile[0].isFollow(userId) || profileToFollow[0].isFollower(loginUserId))
                next(ErrorHandler.badRequest('you already follow that profile !!'))   

            profileToFollow[0].followers.push(loginUserId)
            const[updatedAuthProfileData] = await Promise.all([AuthUserProfile[0].follow(userId),profileToFollow[0].save()])
            return res.data(updatedAuthProfileData)

        } catch (error) {
            next(error)   
        }
    },

    async  unfollowProfile(req,res,next){
        try {
            const {_id:authUserId}    = req.user;
            const {userId:unfollowId} =  req.params;
            if(unfollowId==authUserId.toString())
                return next(ErrorHandler.badRequest('you can not follow own profile!!'))   
            const [AuthUserProfile,profileToUnFollow] = await Promise.all([
                Profile.findOne({user:authUserId}),
                Profile.findOne({user:unfollowId})
            ])
            if(!profileToUnFollow)
                return next(ErrorHandler.notFound('profile does not exist!!'))  
                
            if(!AuthUserProfile.isFollow(unfollowId))
                return next(ErrorHandler.badRequest('you do not follow that profile !!'))   
                
            profileToUnFollow.followers.remove(authUserId)
            const [updateProfile] = await Promise.all([AuthUserProfile.unFollow(unfollowId),profileToUnFollow.save()])
            return res.data(updateProfile)
        } catch (error) {
            next(error)
        }
    },

 
    async updateProfileForAdmin(req,res,next){  
        const {userId} = req.params;
        const fields   = ['bio', 'location', 'website', 'birthday', 'backgroundImage'];
        const newValue = pick(req.body,fields)
        const prof     = await Profile.findOne({user:userId})
        if(!prof)
            return next(ErrorHandler.notFound('profile not found!!!'))  

        Object.assign(prof,newValue);
        await prof.save();
        return res.data(prof)
    }
}

export default ProfileController