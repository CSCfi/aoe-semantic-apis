import request from 'supertest';
import { Express } from 'express-serve-static-core';
import app from '../../app';

const server: Express = app;

describe('GET /ammattikoulu-tutkinnot', () => {
    it('should return 200 & response to be defined', async (done) => {
        request(server)
            .get('/api/v1/ammattikoulu-tutkinnot/fi')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                expect(res.body).toBeDefined();

                done();
            });
    });

    it('should return 404 & valid error response if data was not found', async (done) => {
        request(server)
            .get('/api/v1/ammattikoulu-tutkinnot/asd123')
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                expect(res.body).toMatchObject({
                    error: 'Not Found',
                });

                done();
            });
    });

    it('should return 404 & valid error response if data was not found', async (done) => {
        request(server)
            .get('/api/v1/ammattikoulu-tutkinnon-osat/dadasd/fi')
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                expect(res.body).toMatchObject({
                    error: 'Not Found',
                });

                done();
            });
    });
});
