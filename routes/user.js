
const { addUser,get_All_Users,getUserById,deleteUserById } = require("../controllers/user");

const routes = [
    {
        method: 'POST',
        url: '/api/users',
        handler: addUser
    },
    {
        method: 'GET',
        url: '/api/users',
        handler: get_All_Users
    },
    {
        
        method: 'GET',
        url: '/api/users/{id}',
        handler: getUserById
    },
    {
        method: 'DELETE',
        url: '/api/users/{id}',
        handler: deleteUserById
    }



];

module.exports = routes;