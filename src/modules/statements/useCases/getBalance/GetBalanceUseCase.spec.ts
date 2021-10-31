import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let userRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepository, userRepository);
  });

  it("Should be able to get a balance", async () => {
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

    const result = await getBalanceUseCase.execute({ user_id: user.id as string})

    expect(result).toHaveProperty('balance');
    expect(result.statement.length).toBe(1);
  });

  it("Should not be able to get balance of an invalid user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "0"})
    }).rejects.toBeInstanceOf(GetBalanceError)
  });

})
