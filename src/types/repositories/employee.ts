import type { Effect } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, EmployeeSchema, EmployeeWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../errors/employees.js"

type Employee = EmployeeSchema.Employee
type EmployeeArray = EmployeeSchema.EmployeeArray
export type EmployeeWithoutId = Omit<Employee, "id">

export type CreateEmployeeDto = Omit<Employee, "id" | "createdAt" | "updatedAt" | "deletedAt" | "_tag">
export type UpdateEmployeeDto = CreateEmployeeDto & {
  id?: Employee["id"]
}

export type EmployeeRepository = {
  create: (data: EmployeeSchema.CreateEmployeeEncoded) => Effect.Effect<Employee, Errors.CreateEmployeeError | ParseError>
  findById: (id: Branded.EmployeeId) => Effect.Effect<Employee, Errors.FindEmployeeByIdError | ParseError | NoSuchElementException>
  findByIdWithRelations: (id: Branded.EmployeeId) => Effect.Effect<EmployeeWithRelationsSchema.EmployeeWithRelations, Errors.FindEmployeeByIdError | ParseError | NoSuchElementException>
  findMany: () => Effect.Effect<EmployeeArray, Errors.FindManyEmployeesError>
  findManyWithRelations: () => Effect.Effect<EmployeeWithRelationsSchema.EmployeeWithRelationsArray, Errors.FindManyEmployeesError>
  update: (id: Branded.EmployeeId, data: UpdateEmployeeDto) => Effect.Effect<Employee, Errors.UpdateEmployeeError | ParseError>
  updatePartial: (id: Branded.EmployeeId, data: Partial<UpdateEmployeeDto>) => Effect.Effect<Employee, Errors.UpdateEmployeeError | ParseError>
  remove: (id: Branded.EmployeeId) => Effect.Effect<Employee, Errors.RemoveEmployeeError>
  hardRemove: (id: Branded.EmployeeId) => Effect.Effect<Employee, Errors.RemoveEmployeeError>
}
