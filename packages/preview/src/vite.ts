import express, { Express } from 'express'
import { createServer } from 'vite'
import getDevConfig from './config/dev'
import { MainEntry, DevOptions, VirtualImportField } from './const'
import { virtualEntry } from './virtualEntry'

function getIndexHtml(mainEntries: MainEntry[]) {
  const entryStr = mainEntries.reduce((str, entry) => {
    return `${str}
    <div id="${entry.mountId}"></div>
    <script type="module" src="${entry.fieldId}"></script>
    `
  }, '')

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title></title>
    </head>
    <body>
      ${entryStr}
    </body>
  </html>
  `
}

interface DevConfig extends DevOptions {
  port?: number
}

export async function getDevServer(options: DevOptions): Promise<Express> {
  const app = express()
  const mainEntries = virtualEntry(options)

  const virtualImportFields = mainEntries.reduce((entries, entry) => {
    return entries.concat(...entry.virtualApp)
  }, [] as VirtualImportField[])

  const config = getDevConfig(virtualImportFields, options.execType)
  const vite = await createServer({
    ...config,
    configFile: false,
    server: {
      middlewareMode: 'ssr',
    }
  })
  const indexHtml = getIndexHtml(mainEntries)
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    const url = req.originalUrl
    try {
      const html = await vite.transformIndexHtml(url, indexHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.error(e)
      res.status(500).end(e.message)
    }
  })
  return app
}

export async function startDev(options: DevConfig) {
  const app = await getDevServer(options)
  const port = options.port ?? 3000
  app.listen(port, () => {
    console.log(`
    > http://localhost:${port}
    `)
  })
}
