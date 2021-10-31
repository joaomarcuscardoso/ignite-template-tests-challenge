import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    expect(user).toHaveProperty("id")
  });

  it("Should no be able to create a new user with an already used email", async () => {
    await createUserUseCase.execute({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        password: "123456",
        email: "test@test.com"
      })
    }).rejects.toBeInstanceOf(AppError);
  });

})
