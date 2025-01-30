// commonjs import style
// const http = require('http')

// module import style
// import http from 'http'
// "type": "module" in package.json

// Query Parameters: URL Statful => Filtros, paginação, não-obrigatórios
//  http://localhost:3333/users?userId=1

// Route Parameters: identificaçõa de recurso
//  GET http://localhost:3333/users/1

// Rquest Body: Envio de informações de um formulario pelo corpo (HTTPs)
//  POST http://localhost:3333/users

import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const users = []

const server = http.createServer(async(req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)