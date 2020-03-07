process.env.NODE_ENV = 'test';

const mocha = require('mocha')
const chai = require('chai');
const should = chai.should();
const tokenHelper = require('../../helpers/token');


describe('Token Helper', () => {
    describe('#generate() -  generate token', () => {
        it('should generate a random 16 length token', done => {
            tokenHelper.generate((error, token) => {
                if(error) throw error;

                should.exist(token);
                token.should.be.a('string');
                token.length.should.equal(16);
                done();
            });
        });

        it('should genearate a random 32 length token', done => {
            tokenHelper.generate(32, (error, token) => {
                if(error) throw error;

                should.exist(token);
                token.should.be.a('string');
                token.length.should.equal(32);
                done();
            });
        });
    });
});

