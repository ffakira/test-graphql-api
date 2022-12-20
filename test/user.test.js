const { describe, expect, it } = require('@jest/globals')
const request = require('supertest')
const app = require('../server')

const ROUTES = {
  register: '/user/register',
  login: '/user/login'
}

describe('POST /user', () => {
  describe('given username and password', () => {
    // should save the username and password to the database
    it('should respond with a json object containing the username', async () => {
      const response = await request(app).post(ROUTES.register).send({
        username: 'Test',
        password: 'Password'
      })
      expect(response.statusCode).toBe(201)
      expect(JSON.parse(response.text)).toStrictEqual({
        status: 201,
        data: { username: 'Test' }
      })
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
    })
  })

  describe('when the username or password attribute is missing', () => {
    it('should respond with a status code of 400', async () => {
      const bodyData = [
        { username: 'test' },
        { password: 'password' },
        { username: null, password: null },
        { username: undefined, password: undefined },
        {}
      ]
      for (const body of bodyData) {
        const response = await request(app).post(ROUTES.register).send(body)
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.text)).toStrictEqual({
          status: 400,
          message: 'Missing attribute: username or password'
        })
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
      }
    })
  })
})