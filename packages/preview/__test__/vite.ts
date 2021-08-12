import request from 'supertest'
import path from 'path'

import { ExecType } from '../src/const'
import { getDevServer } from '../src/vite'


describe('server should start right', () => {
  test('vite server should start right', async () => {
    const app = await getDevServer({
      execType: ExecType.REACT,
      file: path.resolve(__dirname, './App.jsx')
    })
    const response = await request(app).get("/")
    expect(response.statusCode).toBe(200)
  })
})

