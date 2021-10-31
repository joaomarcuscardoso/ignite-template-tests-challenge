import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let userRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementRepository);
  });

  it("Should be able to create a new statement deposit", async () => {
    const user = await userRepository.create({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    const result = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test"
    });

    expect(result).toHaveProperty('id');
    expect(result.user_id).toMatch(user.id as string)
  });

  it("Should be able to create a new statement withdraw", async () => {
    const user = await userRepository.create({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "Test"
    });

    const result = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "Test"
    });

    expect(result).toHaveProperty('id');
    expect(result.user_id).toMatch(user.id as string)
  });

  it("Should not be able to create a new statement for an invalid user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "0",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Test"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to create a new statement withdraw with no funds", async () => {
    const user = await userRepository.create({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Test"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });

})
