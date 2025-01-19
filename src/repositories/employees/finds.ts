import type { PrismaClient } from "@prisma/client"

import type { EmployeeRepository } from "../../types/repositories/employee.js"
import { Effect } from "effect"
import { EmployeeSchema, EmployeeWithRelationsSchema, Helpers } from "../../schema/index.js"
import * as Errors from "../../types/errors/employees.js"

export function findMany(prismaClient: PrismaClient): EmployeeRepository["findMany"] {
  return () => Effect.tryPromise({
    catch: Errors.FindManyEmployeesError.new(),
    try: () => prismaClient.employee.findMany({
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(EmployeeSchema.SchemaArray)),
    Effect.withSpan("findMany.employee.repository"),
  )
}

export function findManyWithRelations(prismaClient: PrismaClient): EmployeeRepository["findManyWithRelations"] {
  return () => Effect.tryPromise({
    catch: Errors.FindManyEmployeesError.new(),
    try: () => prismaClient.employee.findMany({
      include: {
        overtimes: true,
      },
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(EmployeeWithRelationsSchema.SchemaArray)),
    Effect.withSpan("findManyWithRelations.employee.repository"),
  )
}

export function findById(prismaClient: PrismaClient): EmployeeRepository["findById"] {
  return id => Effect.tryPromise({
    catch: Errors.FindEmployeeByIdError.new(),
    try: () => prismaClient.employee.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(EmployeeSchema.Schema)),
    Effect.withSpan("findById.employee.repository"),
  )
}

export function findByIdWithRelations(prismaClient: PrismaClient): EmployeeRepository["findByIdWithRelations"] {
  return id => Effect.tryPromise({
    catch: Errors.FindEmployeeByIdError.new(),
    try: () => prismaClient.employee.findUnique({
      include: {
        overtimes: true,
      },
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(EmployeeWithRelationsSchema.Schema)),
    Effect.withSpan("findByIdWithRelations.employee.repository"),
  )
}
