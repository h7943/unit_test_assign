const utils = require('../helpers/utils');
const User = require('../models/user')
const addUser = async (request, reply)=> {
    try {
        const userBody = request.body;

        userBody.fullName = utils.getFullName(userBody.firstName, userBody.lastName); // test getfull name
        delete userBody.firstName;
        delete userBody.lastName;
        
        const user = new User(userBody);
        const addedUser = await user.save();
        return addedUser;
        
    } catch (error) {
        throw new Error(error.message);
    }
}


const get_All_Users = async(request, reply)=> {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
}
 const getUserById = async(request, reply)=> {
    try {
        const userId = request.params.id;
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

 const deleteUserById =async (request, reply)=> {
    try {
        const userId = request.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        return deletedUser;
    } catch (error) {
        throw new Error(error.message);
    }
}
module.exports ={
    addUser, get_All_Users,getUserById,deleteUserById
}


