import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let userRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepository, statementRepository);
  });

  it("Should be able to get a statement operation", async () => {
    const user = await userRepository.create({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    const statement = await statementRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test"
    });

    const result = await getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: statement.id as string})

    expect(result).toHaveProperty('id');
    expect(result.id).toMatch(statement.id as string);
  });

  it("Should not be able to get an invalid statement operation", async () => {
    const user = await userRepository.create({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: "0"})
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });

  it("Should not be able to get an statement operation of an invalid user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: "0", statement_id: "0"})
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

})
