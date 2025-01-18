import type { EmployeeService } from "../../types/services/employee.js"

import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { Branded, EmployeeWithRelationsSchema, Helpers } from "../../schema/index.js"

const getManyResponseSchema = S.Array(EmployeeWithRelationsSchema.Schema.omit("deletedAt"))

const getManyDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getManyResponseSchema,
        },
      },
      description: "Get Employees",
    },
  },
  tags: ["Employee"],
})

const getByIdResponseSchema = EmployeeWithRelationsSchema.Schema.omit("deletedAt")

const getByIdDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(getByIdResponseSchema),
        },
      },
      description: "Get Employee by EmployeeId",
    },
  },
  tags: ["Employee"],
})

const validateGetByIdRequest = validator("param", S.Struct({
  employeeId: Branded.EmployeeIdFromString,
}))

export function setupEmployeeGetRoutes(employeeService: EmployeeService) {
  const app = new Hono()

  app.get("/", getManyDocs, async (c) => {
    const employees = await employeeService.findMany()
    return c.json(Helpers.fromObjectToSchema(getManyResponseSchema)(employees), 200)
  })

  app.get("/:employeeId", getByIdDocs, validateGetByIdRequest, async (c) => {
    const employeeId = c.req.valid("param").employeeId
    const employee = await employeeService.findOneById(employeeId)
    return c.json(Helpers.fromObjectToSchema(getByIdResponseSchema)(employee), 200)
  })

  return app
}
