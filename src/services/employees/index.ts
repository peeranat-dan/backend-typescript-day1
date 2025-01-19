import type { EmployeeService } from "../../types/services/employee.js"
import { Context, Effect, Layer } from "effect"
import { EmployeeRepositoryContext } from "../../repositories/employees/index.js"

export class EmployeeServiceContext extends Context.Tag("Service/EmployeeService")<EmployeeServiceContext, EmployeeService>() {
  static Live = Layer.effect(this, Effect.all({
    repo: EmployeeRepositoryContext,
  }).pipe(
    Effect.andThen(({ repo }) => {
      return {
        create: data => repo.create(data).pipe(Effect.withSpan("create.employee.service")),
        findMany: () => repo.findManyWithRelations().pipe(Effect.withSpan("findMany.employee.service")),
        findOneById: id => repo.findByIdWithRelations(id).pipe(Effect.withSpan("findById.employee.service")),
        removeById: id => repo.remove(id).pipe(Effect.withSpan("remove.employee.service")),
        update: (id, data) => repo.update(id, data).pipe(Effect.withSpan("update.employee.service")),
      } satisfies EmployeeService
    }),
  ))
}
