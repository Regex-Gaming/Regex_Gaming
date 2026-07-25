import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} from "discord.js";

export default {
    customId: "ticket_rename",

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId("rename_modal")
            .setTitle("Rename Ticket");


        const nameInput = new TextInputBuilder()
            .setCustomId("ticket_name")
            .setLabel("New Ticket Name")
            .setPlaceholder("example: payment-help")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);


        const row = new ActionRowBuilder()
            .addComponents(nameInput);


        modal.addComponents(row);


        await interaction.showModal(modal);
    }
};
