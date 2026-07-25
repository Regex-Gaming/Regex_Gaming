const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Rename a member, channel, or role in the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('Change a member\'s nickname')
        .addUserOption(option =>
          option.setName('target')
            .setDescription('The member you want to rename')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('nickname')
            .setDescription('The new nickname (leave blank to reset)')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription('Change a channel\'s name')
        .addChannelOption(option =>
          option.setName('target')
            .setDescription('The channel to rename')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('name')
            .setDescription('The new channel name')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      if (subcommand === 'user') {
        const targetMember = interaction.options.getMember('target');
        const newNickname = interaction.options.getString('nickname') || null;

        // Check if the bot can manage this user
        if (!targetMember.manageable) {
          return interaction.reply({
            content: '❌ I cannot rename this user. Their role might be higher than mine or they are the server owner.',
            ephemeral: true,
          });
        }

        await targetMember.setNickname(newNickname);
        const action = newNickname ? `renamed to **${newNickname}**` : 'nickname reset';
        return interaction.reply({
          content: `✅ ${targetMember.user.tag} has been ${action}.`,
          ephemeral: true,
        });

      } else if (subcommand === 'channel') {
        const targetChannel = interaction.options.getChannel('target');
        const newName = interaction.options.getString('name');

        if (!targetChannel.manageable) {
          return interaction.reply({
            content: '❌ I do not have permission to rename that channel.',
            ephemeral: true,
          });
        }

        const oldName = targetChannel.name;
        await targetChannel.setName(newName);
        return interaction.reply({
          content: `✅ Channel **#${oldName}** was renamed to **#${newName}**.`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error('Error executing rename command:', error);
      return interaction.reply({
        content: '❌ Something went wrong while renaming. Check my role hierarchy and permissions.',
        ephemeral: true,
      });
    }
  },
};
