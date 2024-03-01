const it = require('ava').default;
const chai = require('chai');
var expect = chai.expect;
const startDB = require('../helpers/DB');
const { addUser, get_All_Users, getUserById, deleteUserById } = require('../controllers/user');
const { MongoMemoryServer } = require('mongodb-memory-server');
const sinon = require("sinon");
const utils = require('../helpers/utils');
const User = require('../models/user')

it.before(async (t) => {
    t.context.mongod = await MongoMemoryServer.create();
    process.env.MONGOURI = t.context.mongod.getUri('itiUnitTesting');
    await startDB();
})


it.after(async (t) => {
    await t.context.mongod.stop({ doCleanUp: true });
})
it('should create one user', async (t) => {
    // setup
    const fullName = 'Hasnaa mohamed';
    const request = {
        body: {
            "firstName": "Hasnaa",
            "lastName": "mohamed",
            "age": 3,
            "job": "developer"
        }
    };
    expectedResult = {
        fullName,
        age: 3,
        "job": "developer",
    }
    // exercise 
    // sinon.stub(utils, 'getFullName').returns(fullName);
    const stub1 = sinon.stub(utils, 'getFullName').callsFake((fname, lname) => {
        expect(fname).to.be.equal(request.body.firstName);
        expect(lname).to.be.equal(request.body.lastName);
        return fullName;
    })
    t.teardown(async ()=>{
        await User.deleteMany({
            fullName: request.body.fullName,
        });
        stub1.restore();
    })
    const actualResult = await addUser(request);
    // verify
    expect(actualResult._doc).to.deep.equal({_id: actualResult._id, __v: actualResult.__v,...expectedResult});
    const users = await User.find({
        fullName,
    }).lean();
    expect(users).to.have.length(1);
    expect(users[0]).to.deep.equal({_id: actualResult._id, __v: actualResult.__v,...expectedResult});
    t.pass();
})

it('should get all users', async (t) => {
   
    // Exercise
    const allUsers = await get_All_Users(); 
    
    // Verify
    expect(allUsers).to.be.an('array');
   
    
    t.pass();
});


it('should get a user by ID', async (t) => {
    // Setup
    const userId = '1'; 
    const userData = { _id: userId, fullName: 'Hasnaa mohamed', age: 30, job: 'developer' };
    sinon.stub(User, 'findById').withArgs(userId).returns(userData);

    // Exercise
    const user = await getUserById({ params: { id: userId } });

    // Verify
    expect(user).to.deep.equal(userData);
});

it('should return null if user ID is not found in getUserById', async (t) => {
    // Setup
    const userId = 'invalidUserID'; 
    sinon.stub(User, 'findById').withArgs(userId).returns(null);

    // Exercise
    const user = await getUserById({ params: { id: userId } });

    // Verify
    expect(user).to.be.null;
});

it('should delete a user by ID', async (t) => {
    // Setup
    const userId = '1';
    const userData = { _id: userId, fullName: 'Hasnaa mohamed', age: 30, job: 'developer' };
    sinon.stub(User, 'findByIdAndDelete').withArgs(userId).returns(userData);

    // Exercise
    const deletedUser = await deleteUserById({ params: { id: userId } });

    // Verify
    expect(deletedUser).to.deep.equal(userData);
});

it('should return null if user ID is not found in deleteUserById', async (t) => {
    // Setup
    const userId = 'invalidUserID'; 
    sinon.stub(User, 'findByIdAndDelete').withArgs(userId).returns(null);

    // Exercise
    const deletedUser = await deleteUserById({ params: { id: userId } });

    // Verify
    expect(deletedUser).to.be.null;
});
