import { Effect, Layer, pipe } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { EmployeeRepositoryContext } from "../../repositories/employees/index.js"
import PrismaClientContext from "../../repositories/prisma.js"
import { Branded, EmployeeWithRelationsSchema, Helpers } from "../../schema/index.js"
import { EmployeeServiceContext } from "../../services/employees/index.js"

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

export function setupEmployeeGetRoutes() {
  const app = new Hono()

  app.get("/", getManyDocs, async (c) => {
    const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema)

    const mainLive
      = pipe(
        EmployeeServiceContext.Live,
        Layer.provide(EmployeeRepositoryContext.Live),
        Layer.provide(PrismaClientContext.Live),
      )

    const program = EmployeeServiceContext.pipe(
      Effect.tap(() => Effect.log("Get all employees")),
      Effect.andThen(service => service.findMany()),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.catchTags({
        FindManyEmployeesError: () => Effect.succeed(c.json({ message: "Find many employees error" }, 500)),
        ParseError: () => Effect.succeed(c.json({ message: "Parse error" }, 500)),
      }),
      Effect.withSpan("GET /.employee.controller"),
      Effect.provide(mainLive),
    )

    const result = await Effect.runPromise(program)
    return result
  })

  app.get("/:employeeId", getByIdDocs, validateGetByIdRequest, async (c) => {
    // const employeeId = c.req.valid("param").employeeId
    // const employee = await employeeService.findOneById(employeeId)
    // return c.json(Helpers.fromObjectToSchema(getByIdResponseSchema)(employee), 200)
    const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema)

    const mainLive
      = pipe(
        EmployeeServiceContext.Live,
        Layer.provide(EmployeeRepositoryContext.Live),
        Layer.provide(PrismaClientContext.Live),
      )

    const program = EmployeeServiceContext.pipe(
      Effect.tap(() => Effect.log("Get employee by id")),
      Effect.andThen(service => service.findOneById(c.req.valid("param").employeeId)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.catchTags({
        FindEmployeeByIdError: () => Effect.succeed(c.json({ message: "Find employee by id error" }, 500)),
        NoSuchElementException: () => Effect.succeed(c.json({ message: "Not found" }, 404)),
        ParseError: () => Effect.succeed(c.json({ message: "Parse error" }, 500)),
      }),
      Effect.withSpan("GET /:employeeId.employee.controller"),
      Effect.provide(mainLive),
    )

    const result = await Effect.runPromise(program)
    return result
  })

  return app
}
