import type { EmployeeService } from "../../types/services/employee.js"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { validator } from "hono-openapi/effect"
import { EmployeeSchema, Helpers } from "../../schema/index.js"

const CreateEmployeeResponseSchema = EmployeeSchema.Schema

const createEmployeeDocs = describeRoute({
  responses: {
    201: {
      content: {
        "application/json": {
          schema: CreateEmployeeResponseSchema,
        },
      },
      description: "Create Employee",
    },
  },
  tags: ["Employee"],
})

const validateCreateEmployee = validator("json", EmployeeSchema.CreateSchema)

export function setupEmployeePostRoutes(employeeService: EmployeeService) {
  const app = new Hono()

  app.post("/", createEmployeeDocs, validateCreateEmployee, async (c) => {
    const body = c.req.valid("json")
    const newEmployee = await employeeService.create(body)
    return c.json(Helpers.fromObjectToSchema(CreateEmployeeResponseSchema)(newEmployee), 201)
  })

  return app
}
