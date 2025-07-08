import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ButtonInteraction,
  Collection,
  Snowflake
} from 'discord.js';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('deletarpersonagem')
    .setDescription('Remove um personagem do seu registro (com confirmação)')
    .addStringOption(opt =>
      opt.setName('nome')
        .setDescription('Nome do personagem a ser deletado')
        .setRequired(true)
    ),

  async execute(interaction: any) {
    const userId = interaction.user.id;
    const nome = interaction.options.getString('nome');
    const path = './src/data/personagens.json';

    if (!fs.existsSync(path)) {
      return interaction.reply('❌ Nenhum personagem salvo ainda.');
    }

    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));

    if (!data[userId]?.[nome]) {
      return interaction.reply(`❌ O personagem **${nome}** não existe.`);
    }

    // Criar botões
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('confirmar_delete')
        .setLabel('✅ Confirmar')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('cancelar_delete')
        .setLabel('❌ Cancelar')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      content: `⚠️ Tem certeza que deseja deletar o personagem **${nome}**?`,
      components: [row]
    });

    // Aguardar resposta por até 15 segundos
    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000 // 15 segundos
    });

    collector.on('collect', async (btnInteraction: ButtonInteraction) => {
      if (btnInteraction.user.id !== userId) {
        return btnInteraction.reply({ content: '❌ Você não pode confirmar essa ação.', ephemeral: true });
      }

      if (btnInteraction.customId === 'confirmar_delete') {
        delete data[userId][nome];

        if (Object.keys(data[userId]).length === 0) {
          delete data[userId];
        }

        fs.writeFileSync(path, JSON.stringify(data, null, 2));

        await btnInteraction.update({
          content: `🗑️ Personagem **${nome}** removido com sucesso.`,
          components: []
        });

        collector.stop();
      } else if (btnInteraction.customId === 'cancelar_delete') {
        await btnInteraction.update({
          content: '❌ Ação cancelada.',
          components: []
        });

        collector.stop();
      }
    });

    collector.on('end', async (_: Collection<Snowflake, ButtonInteraction>, reason: string) => {
      if (reason === 'time') {
        await interaction.editReply({
          content: '⌛ Tempo esgotado. Nenhuma ação realizada.',
          components: []
        });
      }
    });
  }
};