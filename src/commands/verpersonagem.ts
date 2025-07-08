import { SlashCommandBuilder } from 'discord.js';
import { emojis } from '../emojis';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('verpersonagem')
    .setDescription('Mostra os status de um personagem seu')
    .addStringOption(opt =>
      opt.setName('nome').setDescription('Nome do personagem').setRequired(true)),
  
  async execute(interaction: any) {
    const userId = interaction.user.id;
    const nome = interaction.options.getString('nome');
    const path = './src/data/personagens.json';

    if (!fs.existsSync(path)) return interaction.reply('❌ Nenhum personagem salvo ainda.');

    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));

    const personagem = data[userId]?.[nome];

    if (!personagem) {
      return interaction.reply(`❌ Personagem **${nome}** não encontrado.`);
    }

    return interaction.reply(
      `${emojis.ficha} **${nome}**\n` +
      `${emojis.hp} HP: ${personagem.hp_atual} / ${personagem.hp_total}\n` +
      `${emojis.mana} Mana: ${personagem.mana}\n` +
      `${emojis.armadura} Armadura: ${personagem.armadura}\n` +
      `${emojis.situacao} Situação: ${personagem.situacao}`
    );
  }
}
