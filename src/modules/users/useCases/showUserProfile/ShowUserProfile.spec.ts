import { ShowUserProfileError } from "./ShowUserProfileError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepository)
  });

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    const result = await showUserProfileUseCase.execute(user.id as string)

    expect(result).toHaveProperty("id")
    expect(result.id).toMatch(user.id as string)
  });

  it("should not be able to show profile of an invalid user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("0")
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})
