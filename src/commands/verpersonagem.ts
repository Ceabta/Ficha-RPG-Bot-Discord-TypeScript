import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction
} from 'discord.js';
import { emojis } from '../emojis';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('verpersonagem')
    .setDescription('Mostra os status de um personagem seu')
    .addStringOption(opt =>
      opt.setName('nome').setDescription('Nome do personagem').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const nomeBuscado = interaction.options.getString('nome') || '';
    const path = './src/data/personagens.json';

    if (!fs.existsSync(path)) {
      await interaction.reply('❌ Nenhum personagem salvo ainda.');
      return;
    }

    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const personagens = data[userId];

    if (!personagens) {
      await interaction.reply('📭 Você ainda não cadastrou nenhum personagem.');
      return;
    }

    // Busca ignorando maiúsculas/minúsculas
    const nomeReal = Object.keys(personagens).find(
      key => key.toLowerCase() === nomeBuscado.toLowerCase()
    );

    if (!nomeReal) {
      await interaction.reply(`❌ Personagem **${nomeBuscado}** não encontrado.`);
      return;
    }

    const personagem = personagens[nomeReal];

    const embed = new EmbedBuilder()
      .setTitle(`${emojis.ficha} ${personagem.situacao === 'Morto' ? `☠️ ~~${nomeReal}~~ ☠️` : nomeReal}`)
      .setColor(0x2ecc71)
      .setDescription(
        `${emojis.mago} Classe: **${personagem.classe}**\n` +
        `${emojis.hp} HP: **${personagem.hp_atual} / ${personagem.hp_total}**\n` +
        `${emojis.mana} Mana: **${personagem.mana}**\n` +
        `${emojis.sanidade} Sanidade: **${personagem.sanidade}**\n` +
        `${emojis.armadura} Armadura: **${personagem.armadura}**\n` +
        `${emojis.situacao} Situação: **${personagem.situacao}**`
    );

    await interaction.reply({ embeds: [embed] });
  }
};