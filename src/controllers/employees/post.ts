import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtimes/index.js"
import { EmployeeSchema, Helpers } from "../../schema/index.js"
import { EmployeeServiceContext } from "../../services/employees/index.js"

const CreateEmployeeResponseSchema = EmployeeSchema.Schema.omit("deletedAt")

const createEmployeeDocs = describeRoute({
  responses: {
    201: {
      content: {
        "application/json": {
          schema: resolver(CreateEmployeeResponseSchema),
        },
      },
      description: "Created Employee",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Created Employee",
    },
  },
  tags: ["Employee"],
  validateResponse: true,
})

const validateCreateEmployee = validator("json", EmployeeSchema.CreateSchema)

export function setupEmployeePostRoutes() {
  const app = new Hono()

  app.post("/", createEmployeeDocs, validateCreateEmployee, async (c) => {
    const parseResponse = Helpers.fromObjectToSchemaEffect(CreateEmployeeResponseSchema)

    const program = EmployeeServiceContext.pipe(
      Effect.tap(() => Effect.log("Create employee")),
      Effect.andThen(service => service.create(c.req.valid("json"))),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.catchTags({
        CreateEmployeeError: () => Effect.succeed(c.json({ message: "Create employee error" }, 500)),
        ParseError: () => Effect.succeed(c.json({ message: "Parse error" }, 500)),
      }),

      Effect.withSpan("POST / .employee.controller"),
    )

    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  return app
}
