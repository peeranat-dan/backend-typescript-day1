import { config } from "@dotenvx/dotenvx"
import { serve } from "@hono/node-server"
import { Hono } from "hono"

import { setupOpenApi } from "./configure/openapi/setup-openapi.js"
import { setupScalarDocs } from "./configure/openapi/setup-scalar-docs.js"
import * as EmployeeController from "./controllers/employees/index.js"
import healthzApp from "./controllers/healthz.js"
import initEmployeeRepository from "./repositories/employees/index.js"
import prismaClient from "./repositories/prisma.js"
import { initEmployeeService } from "./services/employees/index.js"

config()
const app = new Hono()
setupOpenApi(app)

app.get("/", (c) => {
  return c.text("Hello Hono!")
})

app.route("/docs", setupScalarDocs())
app.route("/healthz", healthzApp)

const employeeRepository = initEmployeeRepository(prismaClient)
const employeeService = initEmployeeService(employeeRepository)
app.route("/employees", EmployeeController.setupEmployeeRoutes(employeeService))

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
