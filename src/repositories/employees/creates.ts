import type { PrismaClient } from "@prisma/client"
import type { EmployeeRepository } from "../../types/repositories/employee.js"
import { Effect } from "effect"
import { EmployeeSchema, Helpers } from "../../schema/index.js"
import * as Errors from "../../types/errors/employees.js"

export function create(prismaClient: PrismaClient): EmployeeRepository["create"] {
  return data => Effect.tryPromise({
    catch: Errors.CreateEmployeeError.new(),
    try: () => prismaClient.employee.create({
      data,
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchemaEffect(EmployeeSchema.Schema)),
    Effect.withSpan("create.employee.repository"),
  )
}
