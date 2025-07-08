import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction
} from 'discord.js';
import { emojis } from '../emojis';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('atualizarstatus')
    .setDescription('Atualiza qualquer atributo de um personagem seu')
    .addStringOption(opt =>
      opt.setName('nome').setDescription('Nome do personagem').setRequired(true))
    .addStringOption(opt =>
      opt.setName('atributo')
        .setDescription('Atributo a ser atualizado (hp_total, hp_atual, mana, armadura, sanidade, situacao, classe, etc)')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('valor')
        .setDescription('Novo valor (número ou texto, ex: 40 ou \"Morto\")')
        .setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const nomeDigitado = interaction.options.getString('nome')!;
    const atributo = interaction.options.getString('atributo')!;
    const valor = interaction.options.getString('valor')!;
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

    const nomeReal = Object.keys(personagens).find(key => key.toLowerCase() === nomeDigitado.toLowerCase());

    if (!nomeReal) {
      await interaction.reply(`❌ Personagem **${nomeDigitado}** não encontrado.`);
      return;
    }

    // Atualizar o valor (tenta converter para número, se falhar, mantém como string)
    const valorFinal = isNaN(Number(valor)) ? valor : Number(valor);
    personagens[nomeReal][atributo] = valorFinal;

    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    const personagem = personagens[nomeReal];

    const embed = new EmbedBuilder()
      .setTitle(`${emojis.ficha} ${nomeReal} atualizado!`)
      .setColor(0x2ecc71)
      .setDescription(
        `${emojis.mago} Classe: **${personagem.classe ?? 'Não definida'}**\n` +
        `${emojis.hp} HP: **${personagem.hp_atual} / ${personagem.hp_total}**\n` +
        `${emojis.mana} Mana: **${personagem.mana}**\n` +
        `${emojis.sanidade} Sanidade: **${personagem.sanidade}**\n` +
        `${emojis.armadura} Armadura: **${personagem.armadura}**\n` +
        `${emojis.situacao} Situação: **${personagem.situacao}**`
      );

    await interaction.reply({ embeds: [embed] });
  }
};