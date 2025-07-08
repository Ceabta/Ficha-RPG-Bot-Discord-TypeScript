import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  ChatInputCommandInteraction,
  StringSelectMenuInteraction
} from 'discord.js';
import { emojis } from '../emojis';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('addpersonagem')
    .setDescription('Adiciona um personagem com status básicos')
    .addStringOption(opt =>
      opt.setName('nome').setDescription('Nome do personagem').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('hp_total').setDescription('Vida Total').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('hp_atual').setDescription('Vida Atual').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('armadura').setDescription('Armadura (CA/Defesa)').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('mana').setDescription('Mana').setRequired(false))
    .addIntegerOption(opt =>
      opt.setName('sanidade').setDescription('Sanidade').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const nome = interaction.options.getString('nome')!;
    const hp_total = interaction.options.getInteger('hp_total')!;
    const hp_atual = interaction.options.getInteger('hp_atual')!;
    const armadura = interaction.options.getInteger('armadura')!;
    const mana = interaction.options.getInteger('mana') ?? 0;
    const sanidade = interaction.options.getInteger('sanidade') ?? 100;
    const situacao = 'Vivo';
    const userId = interaction.user.id;
    const path = './src/data/personagens.json';

    let data: any = {};
    if (fs.existsSync(path)) {
      const raw = fs.readFileSync(path, 'utf-8');
      data = JSON.parse(raw);
    }

    if (!data[userId]) data[userId] = {};
    const nomesExistentes = Object.keys(data[userId]);
    const nomeJaExiste = nomesExistentes.some(n => n.toLowerCase() === nome.toLowerCase());

    if (nomeJaExiste) {
      await interaction.reply(`❌ Já existe um personagem chamado **${nome}** (ignorando maiúsculas/minúsculas).`);
      return;
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('selecao_classe')
      .setPlaceholder('Escolha a classe do personagem')
      .addOptions(
        { label: 'Guerreiro', value: 'Guerreiro' },
        { label: 'Mago', value: 'Mago' },
        { label: 'Clérigo', value: 'Clérigo' },
        { label: 'Ladino', value: 'Ladino' },
        { label: 'Bárbaro', value: 'Bárbaro' },
        { label: 'Paladino', value: 'Paladino' },
        { label: 'Bardo', value: 'Bardo' }
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    await interaction.reply({
      content: `${emojis.mago} Escolha a **classe** para o personagem **${nome}**:`,
      components: [row],
      ephemeral: true
    });

    const collector = interaction.channel!.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 15000,
      max: 1
    });

    collector.on('collect', async (selectInteraction: StringSelectMenuInteraction) => {
      if (selectInteraction.user.id !== interaction.user.id) {
        await selectInteraction.reply({ content: '❌ Esse menu não é para você.', ephemeral: true });
        return;
      }

      const classe = selectInteraction.values[0];
      data[userId][nome] = { hp_total, hp_atual, mana, sanidade, armadura, situacao, classe };
      fs.writeFileSync(path, JSON.stringify(data, null, 2));

      const embed = new EmbedBuilder()
        .setTitle(`${emojis.ficha} ${nome} criado!`)
        .setColor(0x3498db)
        .setDescription(
          `${emojis.mago} Classe: **${classe}**
` +
          `${emojis.hp} HP: **${hp_atual} / ${hp_total}**
` +
          `${emojis.mana} Mana: **${mana}**
` +
          `${emojis.sanidade} Sanidade: **${sanidade}**
` +
          `${emojis.armadura} Armadura: **${armadura}**
` +
          `${emojis.situacao} Situação: **${situacao}**`
        );

      await selectInteraction.update({ content: '', embeds: [embed], components: [] });
    });
  }
};