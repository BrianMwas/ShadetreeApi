process.env.NODE_ENV = 'test';

const mocha = require('mocha');
const chai = require('chai');
const should = chai.should();
const passwordHelper = require('../../helpers/password');


describe('Password helper', () => {
    describe('#Hash() - password hashing', () => {
        it('should return a hash and a salt from a plain string', done => {
            passwordHelper.hash('P@ssword!', (error, hash, salt) => {
                if(error)  throw error;

                should.exist(hash);
                should.exist(salt);
                hash.should.be.a('string');
                salt.should.be.a('string');
                hash.should.not.equal('P@ssword!');
                done();
            });
        });

        it('should return only a hash from a plain string if salt is given', done => {
            passwordHelper.hash('P@ssword!', 'secret salt', (error, hash, salt) => {
                if(error)  throw error;

                should.exist(hash);
                salt.should.equal('secret salt');
                hash.should.be.a('string');
                hash.should.not.equal('P@ssword!');
                done();
            });
        });

        it('should return the same hash if the password and salt are the same', done => {
            passwordHelper.hash('P@ssword!', (error, hash, salt) => {
                if(error) throw error;

                passwordHelper.hash('P@ssword!', salt, (error, hashWithSalt) => {
                    if(error) throw error;

                    should.exist(hash);
                    hash.should.be.a('string');
                    hash.should.not.equal('P@ssword!');
                    hash.should.equal(hashWithSalt);
                    done();
                });
            });
        });
    });

    describe('#verify() - compare a password with a hash', () => {
        it('should return true if password matches the hash', done => {
            passwordHelper.hash('myP@ssword!', (error, hash, salt) => {
                if(error) throw error;

                passwordHelper.verify('myP@ssword!', hash, salt, (error, result) => {
                    if(error) throw error;

                    should.exist(result);
                    result.should.be.a('boolean');
                    result.should.equal(true);
                    done();
                });
            });
        });

        it('should return false if the password does match the hash', done => {
            passwordHelper.hash('myP@ssword!', (error, hash, salt) => {
                if (error) throw error;

                passwordHelper.verify('passwordmy', hash, salt, (error, result) => {
                    if (error) throw error;

                    should.exist(result);
                    result.should.be.a('boolean');
                    result.should.equal(false);
                    done();
                });
            });
        })
    });
});
