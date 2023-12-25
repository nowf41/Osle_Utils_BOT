const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lucks = ['大吉', '吉', '中吉', '小吉', '末吉', '凶', '大凶'];
const omikuji_jinoBun_base = [
    '参拝を済ませ、おみくじを引くことにした。\n',
    '硬貨が小気味よい音を立て落ちていく。\n',
    '巫女さんに見守られながら、中から一枚の紙を引き出した。\n',
    'そこには"""LUCKTEXT"""と書かれていた。\n',
    '引いてくれてありがとう！また明日挑戦してね！\n'
];
let alreadyPlayedPeople = [];
const messagesFilePath = '../../res/messages/commands/omikuji.json'

function generateOmikujiEmbed(luck /* 運勢インデックス */, index /* 何番目の演出か. {x|0≦x≦3∧x∈𝕎}  */) {
    const luckText = lucks[luck];
    if(!luckText) throw new Error('Unknown luck index');
    let omikuji_jinoBun_cache = omikuji_jinoBun_base;
    omikuji_jinoBun_cache[3] = 'そこには`' + luckText + '`と書かれていた。\n'
    let embedText = '';
    for(let i = 0; i <= index; i++) embedText += omikuji_jinoBun_cache[i];
    const embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription(embedText);
    return embed;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('omikuji')
        .setDescription('draw a Omikuji.')
        .setDescriptionLocalization('ja', 'おみくじを引きます。'),
        async execute(interaction) {
            const luckIndex = Math.floor(Math.random() * lucks.length);
            if(!alreadyPlayedPeople.includes(interaction.user.id)){
                alreadyPlayedPeople += interaction.user.id;
            } else {
                interaction.reply({content: require(messagesFilePath).errorMessage.alreadyDrewOmikuji, ephemeral: true});
                return;
            }
            await interaction.reply(require(messagesFilePath).whenDrawOmikuji.firstMessage);
            setTimeout(async () => await interaction.editReply({embeds: [generateOmikujiEmbed(luckIndex, 0)]}), 500);
            setTimeout(async () => await interaction.editReply({embeds: [generateOmikujiEmbed(luckIndex, 1)]}), 2000);
            setTimeout(async () => await interaction.editReply({embeds: [generateOmikujiEmbed(luckIndex, 2)]}), 3500);
            setTimeout(async () => await interaction.editReply({embeds: [generateOmikujiEmbed(luckIndex, 3)]}), 5000);
            setTimeout(async () => await interaction.editReply({embeds: [generateOmikujiEmbed(luckIndex, 4)]}), 6500);
        }
}