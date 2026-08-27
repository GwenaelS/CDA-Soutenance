import { Inject, Injectable } from '@nestjs/common';
import { COMMANDS, Command } from './command.interface';

@Injectable()
export class CommandRegistryService {
  private readonly commands = new Map<string, Command>();

  constructor(@Inject(COMMANDS) commands: Command[]) {
    for (const command of commands) {
      this.commands.set(command.data.name, command);
    }
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  getAll(): Command[] {
    return [...this.commands.values()];
  }
}
