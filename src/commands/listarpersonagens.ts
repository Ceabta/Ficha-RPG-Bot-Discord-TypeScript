import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ChatInputCommandInteraction,
  ButtonInteraction,
  Collection,
  Snowflake
} from 'discord.js';
import fs from 'fs';
import { emojis } from '../emojis';

export default {
  data: new SlashCommandBuilder()
    .setName('listarpersonagens')
    .setDescription('Lista todos os personagens cadastrados por você'),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const path = './src/data/personagens.json';

    if (!fs.existsSync(path)) {
      await interaction.reply('❌ Nenhum personagem salvo ainda.');
    }

    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const personagens = data[userId];

    if (!personagens || Object.keys(personagens).length === 0) {
      await interaction.reply('📭 Você ainda não cadastrou nenhum personagem.');
    }

    const nomes = Object.keys(personagens);
    const porPagina = 3;
    let paginaAtual = 0;

    const totalPaginas = Math.ceil(nomes.length / porPagina);

    // Função para criar embed de página
    const gerarEmbed = (pagina: number) => {
    const inicio = pagina * porPagina;
    const fim = inicio + porPagina;
    const slice = nomes.slice(inicio, fim);

    const embed = new EmbedBuilder()
      .setTitle(' Seus Personagens ')
      .setColor(0x2ecc71)
      .setFooter({
        text: `Página ${pagina + 1} de ${totalPaginas}`
      });

    for (let i = 0; i < slice.length; i++) {
      const nome = slice[i];
      const personagem = personagens[nome];

      embed.addFields({
        name: personagens[nome].situacao === 'Morto' 
          ? `${emojis.ficha} ☠️ ~~${nome}~~ ☠️`
          : `${emojis.ficha} ${nome}`,
        value:
          `${emojis.mago} Classe: **${personagem.classe}**\n` +
          `${emojis.hp} HP: **${personagem.hp_atual}/${personagem.hp_total}**\n` +
          `${emojis.mana} Mana: **${personagem.mana}**\n` +
          `${emojis.sanidade} Sanidade: **${personagem.sanidade}**\n` +
          `${emojis.armadura} Armadura: **${personagem.armadura}**\n` +
          `${emojis.situacao} Situação: **${personagem.situacao}**`,
        inline: false // vertical
      });

      // Se não for o último personagem da página, adiciona uma linha divisória
      if (i < slice.length - 1) {
        embed.addFields({
          name: '\u200b',
          value: '────────────',
          inline: false
        });
      }
    }

    return embed;
  };

    const gerarBotoes = () => {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('anterior')
          .setLabel('⬅️ Anterior')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(paginaAtual === 0),
        new ButtonBuilder()
          .setCustomId('proxima')
          .setLabel('➡️ Próxima')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(paginaAtual === totalPaginas - 1)
      );
    };

    const reply = await interaction.reply({
      embeds: [gerarEmbed(paginaAtual)],
      components: [gerarBotoes()],
      fetchReply: true
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000 // 1 minuto
    });

    collector.on('collect', async i => {
      if (i.user.id !== userId) {
        return i.reply({ content: '❌ Esses botões não são para você.', ephemeral: true });
      }

      if (i.customId === 'anterior' && paginaAtual > 0) {
        paginaAtual--;
      } else if (i.customId === 'proxima' && paginaAtual < totalPaginas - 1) {
        paginaAtual++;
      }

      await i.update({
        embeds: [gerarEmbed(paginaAtual)],
        components: [gerarBotoes()]
      });
    });

    collector.on('end', async (_: Collection<Snowflake, ButtonInteraction>, reason: string) => {
      if (reason === 'time') {
        await interaction.editReply({
          content: '⌛ Tempo esgotado. Reabra o comando para ver novamente.',
          embeds: [],
          components: []
        });
      }
    });
  }
};