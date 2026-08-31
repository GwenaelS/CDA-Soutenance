import { Test, TestingModule } from '@nestjs/testing';
import { MessageCreateListener } from './message-create.listener';
import { BotService } from 'src/discord/bot.service';
import { AuditService } from 'src/utils/audit.service';
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

  const mockAuditService = {
    record: jest.fn(),
    postSimpleEmbed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageCreateListener,
        { provide: BotService, useValue: mockBotService },
        { provide: AuditService, useValue: mockAuditService },
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

  function baseMessage(overrides: Record<string, any> = {}) {
    return {
      author: { bot: false, tag: 'User#1111', id: '111' },
      guild: { id: 'guild1' },
      guildId: '123456',
      channelId: 'chan1',
      content: '',
      mentions: {
        users: { size: 0 },
        roles: { size: 0 },
        everyone: false,
      },
      delete: jest.fn().mockResolvedValue({}),
      ...overrides,
    } as any;
  }

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  it('should ignore messages from bots', async () => {
    const mockMessage = baseMessage({
      author: { bot: true, tag: 'BadBot#1234', id: '999' },
      content: 'Insulte',
    });

    await listener['handleMessage'](mockMessage);

    expect(mockMessage.delete).not.toHaveBeenCalled();
  });

  it('should ignore banned words if the user has an exempted role', async () => {
    mockExempteRoleRepository.find.mockResolvedValue([{ role_id: '777' }]);

    const mockMessage = baseMessage({
      content: 'MotInterdit',
      member: {
        roles: {
          cache: {
            some: (cb: any) => cb({ id: '777' }),
          },
        },
      },
    });

    await listener['handleMessage'](mockMessage);

    expect(mockMessage.delete).not.toHaveBeenCalled();
  });

  it('should delete the message if it contains a banned word and user is not exempted', async () => {
    mockExempteRoleRepository.find.mockResolvedValue([]);
    mockFilteredWordRepository.find.mockResolvedValue([{ word: 'Débile' }]);

    const mockMessage = baseMessage({
      author: { bot: false, tag: 'Gamer#0001', id: '222' },
      content: 'tu es vraiment un débile !',
      member: {
        roles: {
          cache: {
            some: () => false,
          },
        },
      },
    });

    await listener['handleMessage'](mockMessage);

    expect(mockMessage.delete).toHaveBeenCalled();
  });
});
