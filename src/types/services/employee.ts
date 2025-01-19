import type { Effect } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, EmployeeSchema, EmployeeWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../errors/employees.js"

export type EmployeeService = {
  create: (data: EmployeeSchema.CreateEmployee) => Effect.Effect<EmployeeSchema.Employee, Errors.CreateEmployeeError | ParseError>
  findMany: () => Effect.Effect<EmployeeWithRelationsSchema.EmployeeWithRelationsArray, Errors.FindManyEmployeesError>
  findOneById: (id: Branded.EmployeeId) => Effect.Effect<EmployeeWithRelationsSchema.EmployeeWithRelations, Errors.FindEmployeeByIdError | ParseError | NoSuchElementException>
  removeById: (id: Branded.EmployeeId) => Effect.Effect<EmployeeSchema.Employee, Errors.RemoveEmployeeError>
  update: (id: Branded.EmployeeId, data: EmployeeSchema.UpdateEmployee) => Effect.Effect<EmployeeSchema.Employee, Errors.UpdateEmployeeError | ParseError>
}
