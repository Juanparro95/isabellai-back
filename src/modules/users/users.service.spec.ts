import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('Debe crear un usuario', async () => {
    const userDto = {
      name: 'Juan',
      email: 'juan@example.com',
      password: '123456',
    };
    const user = new User();
    Object.assign(user, userDto);

    // ⚠️ Aquí nos aseguramos de que 'save' devuelve correctamente un usuario
    jest.spyOn(repository, 'create').mockReturnValue(user);
    jest.spyOn(repository, 'save').mockResolvedValue(user);

    const result = await service.create(userDto);
    expect(result).toEqual(user);
    expect(repository.create).toHaveBeenCalledWith(userDto);
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('Debe obtener todos los usuarios', async () => {
    const users = [
      { id: 1, name: 'Juan', email: 'juan@example.com', password: '123456' },
      { id: 2, name: 'Pedro', email: 'pedro@example.com', password: '654321' },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(users);

    const result = await service.findAll();
    expect(result).toEqual(users);
  });

  it('Debe obtener un usuario por ID', async () => {
    const user = {
      id: 1,
      name: 'Juan',
      email: 'juan@example.com',
      password: '123456',
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(user);

    const result = await service.findOne(1);
    expect(result).toEqual(user);
  });

  it('Debe actualizar un usuario', async () => {
    const existingUser = {
      id: 1,
      name: 'Juan',
      email: 'juan@example.com',
      password: '123456',
    };
    const updateUserDto = { name: 'Juan Actualizado' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(existingUser);
    jest.spyOn(repository, 'save').mockImplementation(async (user) => {
      return { ...existingUser, ...updateUserDto };
    });

    const result = await service.update(1, updateUserDto);
    expect(result.name).toBe('Juan Actualizado');
  });

  it('Debe eliminar un usuario', async () => {
    const user = {
      id: 1,
      name: 'Juan',
      email: 'juan@example.com',
      password: '123456',
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(user);
    jest.spyOn(repository, 'remove').mockResolvedValue(undefined!);

    await service.remove(1);
    expect(repository.remove).toHaveBeenCalledWith(user);
  });
});
