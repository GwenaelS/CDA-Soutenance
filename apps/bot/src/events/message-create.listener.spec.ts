import { Test, TestingModule } from '@nestjs/testing';
import { MessageCreateListener } from './message-create.listener';
import { BotService } from 'src/discord/bot.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exempted_role, Filtered_word } from '@wystrelia/shared/entities';

describe('MessageCreateListener', () => {
  let listener: MessageCreateListener;

  const mockFilteredWordRepository = {
    find: jest.fn(),
  };

  const mockExempteRoleRepository = {
    find: jest.fn(),
  };

  const mockBotService = {
    getClient: jest.fn().mockReturnValue({ on: jest.fn() }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageCreateListener,
        { provide: BotService, useValue: mockBotService },
        {
          provide: getRepositoryToken(Filtered_word),
          useValue: mockFilteredWordRepository,
        },
        {
          provide: getRepositoryToken(Exempted_role),
          useValue: mockExempteRoleRepository,
        },
      ],
    }).compile();

    listener = module.get<MessageCreateListener>(MessageCreateListener);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  it('should ignore messages from bots', async () => {
    const mockMessage = {
      author: { bot: true, tag: 'BadBot#1234' },
      guild: {},
      guildId: '123456',
      content: 'Insulte',
      delete: jest.fn(),
    } as any;

    await listener['handleMessage'](mockMessage);

    expect(mockMessage.delete).not.toHaveBeenCalled();
  });

  it('should ignore banned words if the user has an exempted role', async () => {
    mockExempteRoleRepository.find.mockResolvedValue([{ role_id: '777' }]);

    const mockMessage = {
      author: { bot: false, tag: 'User#1111' },
      guild: {},
      guildId: '123456',
      content: 'MotInterdit',
      member: {
        roles: {
          cache: {
            some: (cb: any) => cb({ id: '777' }),
          },
        },
      },
      delete: jest.fn(),
    } as any;

    await listener['handleMessage'](mockMessage);

    expect(mockMessage.delete).not.toHaveBeenCalled();
  });

  it('should delete the message if it contains a banned word and user is not exempted', async () => {
    mockExempteRoleRepository.find.mockResolvedValue([]);
    mockFilteredWordRepository.find.mockResolvedValue([{ word: 'Débile' }]);

    const mockMessage = {
      author: { bot: false, tag: 'Gamer#0001' },
      guild: {},
      guildId: '123456',
      content: 'tu es vraiment un débile !',
      member: {
        roles: {
          cache: {
            some: () => false,
          },
        },
      },
      delete: jest.fn().mockResolvedValue({}),
    } as any;

    await listener['handleMessage'](mockMessage);

    expect(mockMessage.delete).toHaveBeenCalled();
  });
});
