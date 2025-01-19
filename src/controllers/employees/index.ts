import { Hono } from "hono"
import * as EmployeeGetRoutes from "./get.js"
import * as EmployeePostRoutes from "./post.js"

export function setupEmployeeRoutes() {
  const app = new Hono()

  app.route("/", EmployeeGetRoutes.setupEmployeeGetRoutes())
  app.route("/", EmployeePostRoutes.setupEmployeePostRoutes())

  return app
}
