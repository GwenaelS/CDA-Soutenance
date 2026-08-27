import { GuildMember, PermissionResolvable } from 'discord.js';

/**
 * Vérifie que le membre possède la permission Discord donnée.
 */
export function hasPermission(
  member: GuildMember,
  permission: PermissionResolvable,
): boolean {
  return member.permissions.has(permission);
}

/**
 * Vérifie que l'acteur (modérateur) peut agir sur la cible au regard de la
 * hiérarchie des rôles : le propriétaire du serveur ne peut jamais être ciblé,
 * et l'acteur doit avoir un rôle strictement plus haut que la cible (sauf s'il
 * est lui-même le propriétaire).
 */
export function canModerate(actor: GuildMember, target: GuildMember): boolean {
  if (target.id === actor.guild.ownerId) return false;
  if (actor.id === actor.guild.ownerId) return true;
  return actor.roles.highest.comparePositionTo(target.roles.highest) > 0;
}
