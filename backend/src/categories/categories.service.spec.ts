import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockCategory = {
  id: 'some-uuid',
  name: 'Work',
  color: '#ff0000',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn().mockReturnValue(mockCategory),
            save: jest.fn().mockResolvedValue(mockCategory),
            findAndCount: jest.fn().mockResolvedValue([[mockCategory], 1]),
            findOneBy: jest.fn().mockResolvedValue(mockCategory),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new category', async () => {
      const dto = { name: 'Work', color: '#ff0000' };
      const result = await service.create(dto);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of categories', async () => {
      const result = await service.findAll(1, 10);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([[mockCategory], 1]);
    });
  });

  describe('remove', () => {
    it('should remove the category if it exists', async () => {
      await service.remove('some-uuid');
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'some-uuid' });
      expect(repository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.remove('some-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
