import vite from 'vite'
import getBaseConfig from './config/base'

export async function startDev() {
    const config = getBaseConfig()
    const server = await vite.createServer(config)
    await server.listen()
}

export async function build() {
    const config = getBaseConfig()
    await vite.build(config)
}
