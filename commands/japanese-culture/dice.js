const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('roll a dice.')
        .setDescriptionLocalization('ja', 'サイコロを振ります。')
        .addIntegerOption(option =>
            option
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
                .setName('size')
                .setDescription('size of dice')
                .setDescriptionLocalization('ja', 'サイコロの目の数を指定します。'))
        .addIntegerOption(option =>
            option
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
                .setName('count')
                .setDescription('count of dice')
                .setDescriptionLocalization('ja', 'サイコロの数を指定します。')),

        async execute(interaction) {
            const diceSize = interaction.options.getInteger('size');
            const diceCount = interaction.options.getInteger('count');
            let embedText = '結果:```';
            for(let i = 1; i < diceCount; i++) {
                embedText += (generateDiceValue(diceSize) + `, `);
                if(!(i%10)) embedText += '\n'
            };
            embedText += (generateDiceValue(diceSize));
            embedText += '```';
            const message = new EmbedBuilder()
                .setColor('#932e40')
                .setTitle(`${diceCount}d${diceSize}を振りました。`)
                .setDescription(embedText)
            await interaction.reply({content: 'サイコロを振ります🎲'});
            await interaction.editReply({embeds: [message]});
        }
}

function generateDiceValue(diceSize = 1) {
    let randomisedValue = Math
                    .floor(Math.random() * diceSize + 1)
                    .toString();
                if(diceSize >= 10 && diceSize <= 99 && randomisedValue.length === 1) {
                    randomisedValue = '0' + randomisedValue
                } else if(diceSize >= 100 && diceSize <= 999) {
                    switch(randomisedValue.length) {
                        case 2: randomisedValue = '0' + randomisedValue;break;
                        case 1: randomisedValue = '00' + randomisedValue;break;
                        default: randomisedValue = randomisedValue;
                    }
                }
    return randomisedValue;
}