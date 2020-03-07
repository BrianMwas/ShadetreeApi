process.env.NODE_ENV = 'test';
var userFixture = require('../fixtures/user').factory;
var chai = require('chai');
var should = chai.should();

describe('User model', function() {
    var mongoose;
    var User;
    var _user;
    var newUserData = userFixture.create('User');

    before(function (done) {
        mongoose = require('../../config/mongoose/mongoose').init();
        User = require('../../src/model/user');
        done();
    });

    after(function (done) {
        
        User.deleteOne({ email: newUserData.email }).exec(err => {
            if (err) throw err;

            mongoose.connection.close(() => {
                setTimeout(function () {
                    done();
                }, 1000);
            });
        });
    });

    it('should register a user', function(done) {
        
    
        User.registerUser(newUserData, (error, user) => {
            if(error) throw error;

            should.exist(user);
            user.email.should.equal(newUserData.email);
            should.not.exist(user.password);
            should.not.exist(user.passwordSalt);
            should.exist(user.createdAt);
            
            _user = user;
            done();
        });
        
    });

    it('should not register a user if already exists', done => {
       
        User.registerUser(newUserData, (err, user) => {
            should.exist(err);
            err.code.should.equal(11000); // duplicate key error
            should.not.exist(user);
            done();
        });
    });

    it('should authenticate a user with valid credentials', done => {

       
        User.authenticateUser(newUserData.email, newUserData.password, (err, user) => {
            if (err) throw err;

            should.exist(user);
            should.not.exist(user.password);
            should.not.exist(user.passwordSalt);
            user.email.should.equal(newUserData.email);
            done();
        });
    });
    
})
