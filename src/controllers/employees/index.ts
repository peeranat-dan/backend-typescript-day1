import type { EmployeeService } from "../../types/services/employee.js"
import { Hono } from "hono"
import * as EmployeeGetRoutes from "./get.js"
import * as EmployeePostRoutes from "./post.js"

export function setupEmployeeRoutes(employeeService: EmployeeService) {
  const app = new Hono()

  app.route("/", EmployeeGetRoutes.setupEmployeeGetRoutes())
  app.route("/", EmployeePostRoutes.setupEmployeePostRoutes(employeeService))

  return app
}
