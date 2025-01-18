import { config } from "@dotenvx/dotenvx"
import { serve } from "@hono/node-server"
import { Hono } from "hono"

import { setupOpenApi } from "./configure/openapi/setup-openapi.js"
import { setupScalarDocs } from "./configure/openapi/setup-scalar-docs.js"

config()
const app = new Hono()
setupOpenApi(app)

app.get("/", (c) => {
  return c.text("Hello Hono!")
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

app.route("/docs", setupScalarDocs())

serve({
  fetch: app.fetch,
  port,
})
